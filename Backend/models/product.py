from sqlalchemy import Column, Integer, String, Numeric, Text, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from database.session import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False) 
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    name = Column(String(150), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)

    image_url = Column(Text)
    harvest_date = Column(Date)
    description = Column(Text)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
