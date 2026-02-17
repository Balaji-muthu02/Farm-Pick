from pydantic import BaseModel
from datetime import datetime

class FarmerCreate(BaseModel):
    name: str
    phone: str
    location: str
    user_id: int | None = None
    aadhar_number: str | None = None
    farm_image_url: str | None = None

class FarmerUpdate(BaseModel):
    name: str
    phone: str
    location: str

class FarmerOut(BaseModel):
    id: int
    name: str
    phone: str
    location: str
    user_id: int | None = None
    aadhar_number: str | None = None
    farm_image_url: str | None = None
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True
