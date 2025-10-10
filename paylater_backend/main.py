from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.db import engine, SessionLocal
from models.model import Base
from service.customer import add_customer
from routes.customer import router as customer_router
from routes.merchant import router as merchant_router
from routes.transaction import router as transaction_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# if __name__ == "__main__":
#     session = SessionLocal()
#     customer = add_customer(session, "vamshi", 1234467890, 2000)
#     session.close()


app.include_router(customer_router)
app.include_router(merchant_router)
app.include_router(transaction_router)