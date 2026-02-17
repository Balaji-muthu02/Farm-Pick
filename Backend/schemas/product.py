from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from decimal import Decimal

class ProductCreate(BaseModel):
    farmer_id: int
    category_id: int
    name: str
    price: Decimal
    quantity: int
    image_url: Optional[str] = None
    harvest_date: Optional[date] = None
    description: Optional[str] = None
    is_active: bool = True

class ProductResponse(BaseModel):
    id: int
    farmer_id: int
    category_id: int
    name: str
    price: Decimal
    quantity: int
    image_url: Optional[str]
    harvest_date: Optional[date]
    description: Optional[str]
    farmer_name: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
