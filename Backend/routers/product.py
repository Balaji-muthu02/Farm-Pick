from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from models.product import Product
from schemas.product import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])


from models.farmer import Farmer
from models.category import Category



@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    
    farmer = db.query(Farmer).filter(Farmer.id == product.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail=f"Farmer with id {product.farmer_id} not found")

   
    category = db.query(Category).filter(Category.id == product.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail=f"Category with id {product.category_id} not found")

    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product



@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    for p in products:
        farmer = db.query(Farmer).filter(Farmer.id == p.farmer_id).first()
        if farmer:
            p.farmer_name = farmer.name
    return products



@router.get("/farmer/{farmer_id}", response_model=list[ProductResponse])
def get_farmer_products(farmer_id: int, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.farmer_id == farmer_id).all()
    for p in products:
        farmer = db.query(Farmer).filter(Farmer.id == p.farmer_id).first()
        if farmer:
            p.farmer_name = farmer.name
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    farmer = db.query(Farmer).filter(Farmer.id == product.farmer_id).first()
    if farmer:
        product.farmer_name = farmer.name
        
    return product



@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product_data.dict().items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product



@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
