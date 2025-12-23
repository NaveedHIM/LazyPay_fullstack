from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.db import get_db
from models.model import Merchant
from service.merchant import add_merchant, get_merchant, update_commision
from pydantic import BaseModel


class MerchantBase(BaseModel):
    name: str
    phone: int
    commision: int
    total_earning:int

class MerchantCreate(MerchantBase):
    pass

class MerchantOut(MerchantBase):
    id: int

    class Config:
        orm_mode = True


class MerchantCommisionUpdate(BaseModel):
    commision: int

# --- ROUTER ---
router = APIRouter(
    prefix='/merchant',
    tags=['merchant'],
)


@router.post('/', response_model=MerchantOut, status_code=status.HTTP_201_CREATED)
async def create_merchant(merchant: MerchantCreate, db: Session = Depends(get_db)):
    db_merchant = add_merchant(db, merchant.name, merchant.phone, merchant.commision)
    return db_merchant

@router.get('/',response_model=list[MerchantOut])
async def get_all_merchant(db: Session = Depends(get_db)):
    return get_merchant(db)


@router.patch('/{merchant_id}/commision', response_model=MerchantOut)
async def update_merchant_commision(merchant_id: int, commision_update: MerchantCommisionUpdate, db: Session = Depends(get_db)):
    db_merchant = update_commision(db, merchant_id, commision_update.commision)
    return db_merchant

    