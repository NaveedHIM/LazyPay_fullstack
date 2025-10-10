from models.model import Merchant
from sqlalchemy.orm import Session


def add_merchant(session:Session, name:str, phone: int, commision: int):
    merchant = Merchant(name = name,phone = phone, commision = commision)
    session.add(merchant)
    session.commit()
    return merchant

def update_commision(session: Session, merchant_id: int, new_commision: int):
    merchant = session.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    merchant.commision = new_commision
    session.commit()
    session.refresh(merchant)
    return merchant

def get_merchant(session:Session):
    return session.query(Merchant).all()