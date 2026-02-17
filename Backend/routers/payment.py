from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import SessionLocal
from models.payment import Payment
from schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
    PaymentOut
)

router = APIRouter(prefix="/payments", tags=["Payments"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from models.order import Order


@router.post("/", response_model=PaymentOut)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order with id {payment.order_id} not found")

    new_payment = Payment(**payment.dict())
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment





@router.get("/", response_model=list[PaymentOut])
def get_all_payments(db: Session = Depends(get_db)):
    return db.query(Payment).all()



@router.get("/{payment_id}", response_model=PaymentOut)
def get_payment_by_id(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment



@router.get("/order/{order_id}", response_model=list[PaymentOut])
def get_payments_by_order(order_id: int, db: Session = Depends(get_db)):
    return db.query(Payment).filter(Payment.order_id == order_id).all()



# @router.put("/{payment_id}", response_model=PaymentOut)
# def update_payment(payment_id: int, data: PaymentUpdate, db: Session = Depends(get_db)):
#     payment = db.query(Payment).filter(Payment.id == payment_id).first()
#     if not payment:
#         raise HTTPException(status_code=404, detail="Payment not found")

#     for key, value in data.dict().items():
#         setattr(payment, key, value)

#     db.commit()
#     db.refresh(payment)
#     return payment
