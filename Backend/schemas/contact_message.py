from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ContactMessageCreate(BaseModel):
    user_id: Optional[int] = None
    name: str
    email: str
    category: Optional[str] = None
    subject: Optional[str] = None
    message: str

class ContactMessageOut(BaseModel):
    id: int
    user_id: Optional[int]
    name: str
    email: str
    category: Optional[str] = None
    subject: Optional[str] = None
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
