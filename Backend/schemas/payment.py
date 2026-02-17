from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class PaymentCreate(BaseModel):
    order_id: int
    amount: Decimal
    payment_method: str
    payment_status: str = "pending"
    transaction_id: Optional[str] = None

class PaymentUpdate(BaseModel):
    amount: Optional[Decimal] = None
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    transaction_id: Optional[str] = None
    paid_at: Optional[datetime] = None

class PaymentOut(BaseModel):
    id: int
    order_id: int
    amount: Decimal
    payment_method: str
    payment_status: str
    transaction_id: Optional[str]
    paid_at: Optional[datetime]

    class Config:
        from_attributes = True
