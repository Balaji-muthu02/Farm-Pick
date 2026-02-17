from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

class OrderCreate(BaseModel):
    user_id: int
    total_amount: Decimal
    delivery_address: str
    status: str = "pending"

class CheckoutRequest(BaseModel):
    user_id: int
    delivery_address: str

class OrderUpdate(BaseModel):
    total_amount: Optional[Decimal] = None
    status: Optional[str] = None
    delivery_address: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    user_id: int
    total_amount: Decimal
    status: Optional[str] = "pending"
    delivery_address: Optional[str] = None
    order_date: Optional[datetime] = None
    items: List['OrderItemOut'] = []

    class Config:
        from_attributes = True

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal
    product_name: Optional[str] = None

    class Config:
        from_attributes = True


class OrderItemDetailOut(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderDetailOut(BaseModel):
    order_id: int
    total_amount: float
    status: str
    delivery_address: str | None = None
    items: List[OrderItemDetailOut]

    class Config:
        from_attributes = True

