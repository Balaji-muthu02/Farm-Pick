from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

class AddToCart(BaseModel):
    user_id: int
    product_id: int
    quantity: int

class CartItemOut(BaseModel):
    id: int
    cart_id: int
    product_id: int
    product_name: Optional[str] = None
    image_url: Optional[str] = None
    quantity: int
    price: Decimal
    created_at: datetime

    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: int
    user_id: int
    status: str
    created_at: datetime
    items: List[CartItemOut] = []

    class Config:
        from_attributes = True
