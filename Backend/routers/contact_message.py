from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from models.contact_message import ContactMessage
from schemas.contact_message import ContactMessageCreate,ContactMessageOut


router = APIRouter(
    prefix="/contact-messages",
    tags=["Contact Messages"]
)


@router.post("/", response_model=ContactMessageOut)
def create_message(data: ContactMessageCreate, db: Session = Depends(get_db)):
    message = ContactMessage(**data.dict())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message



@router.get("/", response_model=list[ContactMessageOut])
def get_all_messages(db: Session = Depends(get_db)):
    return db.query(ContactMessage).all()



@router.get("/{id}", response_model=ContactMessageOut)
def get_message_by_id(id: int, db: Session = Depends(get_db)):
    message = db.query(ContactMessage).filter(ContactMessage.id == id).first()
    if not message:
        raise HTTPException(404, "Contact message not found")
    return message


 