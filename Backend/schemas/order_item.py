from pydantic import BaseModel
from decimal import Decimal

class OrderItemCreate(BaseModel):
    order_id: int
    product_id: int
    quantity: int
    price: Decimal

class OrderItemUpdate(BaseModel):
    quantity: int
    price: Decimal

class OrderItemOut(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True
