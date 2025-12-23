from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class Merchant(Base):
    __tablename__ = "merchant"
    id = Column(Integer, primary_key=True)
    name = Column(String(20), unique=True)
    phone = Column(Integer)
    commision = Column(Integer)
    total_earning = Column(Integer,default=0)
    transaction = relationship("Transaction", back_populates="merchant")


class Customer(Base):
    __tablename__ = "customer"
    id = Column(Integer, primary_key=True)
    name = Column(String(20))
    phone = Column(Integer)
    limit = Column(Integer)
    email = Column(String(255), unique=True)                 # NEW
    hashed_password = Column(String(255))                    # NEW
    transaction = relationship("Transaction", back_populates="customer")


class Transaction(Base):
    __tablename__ = "transaction"
    id = Column(Integer, primary_key=True)
    merchant_id = Column(Integer, ForeignKey('merchant.id'), nullable=False)
    customer_id = Column(Integer, ForeignKey('customer.id'), nullable=False)
    transaction_amount = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    is_repaid = Column(Boolean, default=False, nullable=False)
    
    merchant = relationship("Merchant", back_populates="transaction")
    customer = relationship("Customer", back_populates="transaction")

