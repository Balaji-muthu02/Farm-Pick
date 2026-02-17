from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.session import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String, default="pending")
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    delivery_address = Column(Text, nullable=False)

    user = relationship("User")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")
