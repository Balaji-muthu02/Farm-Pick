from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import SessionLocal
from models.order_item import OrderItem
from schemas.order_item import (
    OrderItemCreate,
    OrderItemUpdate,
    OrderItemOut
)

router = APIRouter(prefix="/order-items", tags=["Order Items"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.post("/", response_model=OrderItemOut)
def create_order_item(item: OrderItemCreate, db: Session = Depends(get_db)):
    new_item = OrderItem(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item



@router.get("/{order_id}", response_model=list[OrderItemOut])
def get_items_by_order(order_id: int, db: Session = Depends(get_db)):
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    return items



# @router.put("/{id}", response_model=OrderItemOut)
# def update_order_item(id: int, data: OrderItemUpdate, db: Session = Depends(get_db)):
#     item = db.query(OrderItem).filter(OrderItem.id == id).first()
#     if not item:
#         raise HTTPException(status_code=404, detail="Order item not found")

#     for key, value in data.dict().items():
#         setattr(item, key, value)

#     db.commit()
#     db.refresh(item)
#     return item



# @router.delete("/{id}")
# def delete_order_item(id: int, db: Session = Depends(get_db)):
#     item = db.query(OrderItem).filter(OrderItem.id == id).first()
#     if not item:
#         raise HTTPException(status_code=404, detail="Order item not found")

#     db.delete(item)
#     db.commit()
#     return {"message": "Order item deleted successfully"}
