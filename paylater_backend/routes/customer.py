from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from db.db import get_db
from models.model import Customer
from service.customer import add_customer, get_customer
from pydantic import BaseModel
from service.auth import hash_password, decode_access_token
from service.auth import verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/customer/login")


class CustomerBase(BaseModel):
    name: str
    phone: int
    limit: int

class CustomerCreate(CustomerBase):
    pass

class CustomerOut(CustomerBase):
    id: int

    class Config:
        orm_mode = True

class CustomerSignUp(BaseModel):
    name: str
    phone: int
    limit: int
    email: str
    password: str

class CustomerLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str



# --- ROUTER ---
router = APIRouter(
    prefix='/customer',
    tags=['customer'],
)


# @router.post('/', response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
# def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
#     db_customer = add_customer(db, customer.name, customer.phone, customer.limit)
#     return db_customer

@router.get('/',response_model=list[CustomerOut])
async def get_all_customer(db: Session = Depends(get_db)):
    return get_customer(db)


@router.post('/signup', response_model=CustomerOut)
async def signup(customer: CustomerSignUp, db: Session = Depends(get_db)):
    hashed = hash_password(customer.password)
    db_customer = add_customer(db, customer.name, customer.phone, customer.limit, customer.email, hashed)
    return db_customer

@router.post('/login', response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.email == form_data.username).first()
    if not db_customer or not verify_password(form_data.password, db_customer.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_customer.email, "id": db_customer.id})
    return {"access_token": access_token, "token_type": "bearer"}



async def get_current_customer(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    customer = db.query(Customer).filter(Customer.email == payload["sub"]).first()
    if customer is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Customer not found")
    return customer

@router.get('/protected')
async def secret_stuff(current_customer: Customer = Depends(get_current_customer)):
    return {
        "id": current_customer.id,
        "name": current_customer.name,
        "email": current_customer.email,
        "phone": current_customer.phone,
        "limit": current_customer.limit
    }
