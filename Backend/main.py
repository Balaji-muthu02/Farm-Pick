import os
import sys

# Move this to the very top to ensure local modules are found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database.session import Base, engine
from routers import user
from routers import product
from routers import category
from routers import farmer
from routers import order
from routers import order_item
from routers import payment
# from routers import seller_request
from routers import contact_message
# from models.seller_request import SellerRequest
from routers import cart as cart_router
# from routers import add_to_card
import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database sync error during startup: {e}")
    yield

app = FastAPI(title="FarmPick API", root_path="/api", lifespan=lifespan)
application = app

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user.router)


@app.get("/")
def root():
    return {"message": "Welcome to FarmPick API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Backend"}

app.include_router(category.router)
app.include_router(farmer.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(order_item.router)
app.include_router(payment.router)
# app.include_router(seller_request.router)
app.include_router(contact_message.router)
app.include_router(cart_router.router)

