from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, DateTime
from database.session import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, nullable=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    payment_method = Column(String, nullable=False)
    payment_status = Column(String, default="pending")
    transaction_id = Column(String, nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
