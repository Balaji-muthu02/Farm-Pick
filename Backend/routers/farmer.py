from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db


from database.session import SessionLocal
from models.farmer import Farmer
from schemas.farmer import FarmerCreate, FarmerUpdate, FarmerOut

router = APIRouter(prefix="/farmers", tags=["Farmers"])






@router.post("/", response_model=FarmerOut)
def create_farmer(farmer: FarmerCreate, db: Session = Depends(get_db)):
    new_farmer = Farmer(**farmer.dict())
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)
    return new_farmer



@router.get("/", response_model=list[FarmerOut])
def get_all_farmers(db: Session = Depends(get_db)):
    return db.query(Farmer).all()



@router.get("/{id}", response_model=FarmerOut)
def get_farmer_by_id(id: int, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer

@router.get("/user/{user_id}", response_model=FarmerOut)
def get_farmer_by_user_id(user_id: int, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.user_id == user_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="No farmer record for this user")
    return farmer



@router.put("/{id}", response_model=FarmerOut)
def update_farmer(id: int, data: FarmerUpdate, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    for key, value in data.dict().items():
        setattr(farmer, key, value)

    db.commit()
    db.refresh(farmer)
    return farmer



@router.delete("/{id}")
def delete_farmer(id: int, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    db.delete(farmer)
    db.commit()
    return {"message": "Farmer deleted successfully"}



@router.patch("/{id}/approve", response_model=FarmerOut)
def approve_farmer(id: int, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    farmer.is_approved = True
    
    # Update the associated User's role to 'farmer'
    if farmer.user_id:
        from models.user import User
        user = db.query(User).filter(User.id == farmer.user_id).first()
        if user:
            user.role = 'farmer'
            user.farmer_id = farmer.id

    db.commit()
    db.refresh(farmer)
    return farmer
