from fastapi import APIRouter, Depends, HTTPException, Body
from datetime import datetime
from sqlalchemy.orm import Session
from database.session import get_db
from models.cart import Cart, CartItem
from models.product import Product
from schemas.cart import AddToCart, CartOut

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)

@router.post("/add")
def add_to_cart(request: AddToCart, db: Session = Depends(get_db)):
    
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    
    cart = db.query(Cart).filter(Cart.user_id == request.user_id, Cart.status == "active").first()
    if not cart:
        
        cart = Cart(user_id=request.user_id, status="active")
        db.add(cart)
        db.commit()
        db.refresh(cart)
    

    cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == request.product_id).first()
    
    if cart_item:
        cart_item.quantity += request.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=request.product_id,
            quantity=request.quantity,
            price=product.price
        )
        db.add(cart_item)
        
    db.commit()
    return {"message": "Item added to cart successfully"}

@router.get("/{user_id}", response_model=CartOut)
def get_cart(user_id: int, db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == user_id, Cart.status == "active").first()
    if not cart:
        # Instead of 404, let's return an empty cart structure if none exists
        # This prevents the frontend from breaking on first load
        return Cart(id=0, user_id=user_id, status="active", items=[], created_at=datetime.now())
    
    # Populate extra fields for the frontend
    for item in cart.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            item.product_name = product.name
            item.image_url = product.image_url
            
    return cart




@router.put("/update/{item_id}")
def update_cart_item(item_id: int, quantity: int = Body(..., embed=True), db: Session = Depends(get_db)):
    cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")
    cart_item.quantity = quantity
    db.commit()
    return {"message": "Cart item updated successfully"}







@router.delete("/remove/{item_id}")
def remove_cart_item(item_id: int, db: Session = Depends(get_db)):
    cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(cart_item)
    db.commit()
    return {"message": "Cart item removed successfully"}







