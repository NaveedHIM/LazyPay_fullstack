from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.db import get_db
from service.transaction import add_transaction,pay_back, get_transactions
from pydantic import BaseModel,Field
from typing import List
from datetime import datetime


class TransactionBase(BaseModel):
    customer_id: int
    merchant_id: int
    amount: int


class TransactionCreate(TransactionBase):
    pass

class TransactionRepay(BaseModel):
    transaction_id: int



class TransactionOut(BaseModel):
    id: int
    customer_id: int
    merchant_id: int
    amount: int = Field(alias="transaction_amount")
    timestamp: datetime
    is_repaid: bool

    class Config:
        from_attributes = True
        populate_by_name = True



router = APIRouter(
    prefix='/transaction',
    tags=['transaction'],
)


@router.post('/pay', response_model=TransactionOut)
async def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = add_transaction(db, transaction.customer_id, transaction.merchant_id, transaction.amount)
    return db_transaction


@router.post('/repay', response_model=TransactionOut)
async def create_repaid(repay_data: TransactionRepay, db: Session = Depends(get_db)):
    db_transaction = pay_back(db, repay_data.transaction_id)
    return db_transaction


@router.get('/')
async def read_transactions(db: Session = Depends(get_db)):
    return get_transactions(db)
