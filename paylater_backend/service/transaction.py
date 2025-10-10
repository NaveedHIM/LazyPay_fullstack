from models.model import Transaction, Customer,Merchant
from sqlalchemy.orm import Session
from fastapi import HTTPException

def add_transaction(session: Session, customer_id: int, merchant_id: int, amount: int):
    customer = session.query(Customer).filter(Customer.id == customer_id).first()
    merchant = session.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if amount > customer.limit:
        raise HTTPException(status_code=400, detail="Insufficient credit limit")

    txn = Transaction(
        customer_id=customer_id,
        merchant_id=merchant_id,
        transaction_amount=amount,
        is_repaid=False
    )

    # Deduct the amount from customer's credit limit
    customer.limit -= amount
    company_fee = (merchant.commision/100) * amount
    merchant.total_earning += amount - company_fee
    

    session.add(txn)
    session.commit()
    session.refresh(txn)
    return txn


def pay_back(session: Session, transaction_id: int):
    # Find the specific transaction to repay
    txn = session.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Check if already repaid
    if txn.is_repaid:
        raise HTTPException(status_code=400, detail="Transaction already repaid")
    
    # Get customer and merchant
    customer = session.query(Customer).filter(Customer.id == txn.customer_id).first()
    merchant = session.query(Merchant).filter(Merchant.id == txn.merchant_id).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    # Mark transaction as repaid
    txn.is_repaid = True
    
    # Restore the amount to customer's credit limit
    customer.limit += txn.transaction_amount
    
    # Deduct from merchant's earnings (reverse the original transaction)
    company_fee = (merchant.commision/100) * txn.transaction_amount
    merchant.total_earning -= (txn.transaction_amount - company_fee)

    session.commit()
    session.refresh(txn)
    return txn


def get_transactions(session: Session):
    transactions = session.query(Transaction).all()
    # Convert to dict and map transaction_amount to amount
    result = []
    for txn in transactions:
        txn_dict = {
            'id': txn.id,
            'customer_id': txn.customer_id,
            'merchant_id': txn.merchant_id,
            'amount': txn.transaction_amount,  # Map transaction_amount to amount
            'timestamp': txn.timestamp,
            'is_repaid': txn.is_repaid
        }
        result.append(txn_dict)
    return result
