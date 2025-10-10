from models.model import Customer
from sqlalchemy.orm import Session

def add_customer(session: Session, name: str, phone: int, limit: int, email: str, hashed_password: str):
    customer = Customer(
        name=name,
        phone=phone,
        limit=limit,
        email=email,
        hashed_password=hashed_password
    )
    session.add(customer)
    session.commit()
    return customer


def get_customer(session:Session):
    return session.query(Customer).all()