from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database.session import get_db
from models.order import Order
from models.order_item import OrderItem
from models.cart import Cart, CartItem
from schemas.order import OrderCreate, OrderUpdate, OrderOut, CheckoutRequest
from models.product import Product
from schemas.order import OrderDetailOut


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/checkout", response_model=OrderOut)
def checkout(request: CheckoutRequest, db: Session = Depends(get_db)):
    
    cart = db.query(Cart).filter(Cart.user_id == request.user_id, Cart.status == "active").first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="No active cart or cart is empty")

   
    total_amount = sum(item.price * item.quantity for item in cart.items)

   
    new_order = Order(
        user_id=request.user_id,
        total_amount=total_amount,
        status="pending",
        delivery_address=request.delivery_address
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

   
    for cart_item in cart.items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.price
        )
        db.add(order_item)
    
    
    cart.status = "ordered"
    db.commit()
    
    return new_order


@router.get("/", response_model=list[OrderOut])
def get_all_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.get("/{order_id}/details", response_model=OrderDetailOut)
def get_order_details(order_id: int, db: Session = Depends(get_db)):

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order_items = (
        db.query(OrderItem, Product)
        .join(Product, OrderItem.product_id == Product.id)
        .filter(OrderItem.order_id == order_id)
        .all()
    )

    items = []
    for order_item, product in order_items:
        items.append({
            "product_id": product.id,
            "product_name": product.name,
            "quantity": order_item.quantity,
            "price": order_item.price
        })

    return {
        "order_id": order.id,
        "total_amount": order.total_amount,
        "status": order.status,
        "delivery_address": order.delivery_address,
        "items": items
    }


@router.get("/{order_id}", response_model=OrderOut)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/user/{user_id}", response_model=list[OrderOut])
def get_orders_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product)).filter(Order.user_id == user_id).all()

@router.get("/farmer/{farmer_id}")
def get_farmer_orders(farmer_id: int, db: Session = Depends(get_db)):
    from models.user import User
    
    orders = (
        db.query(Order)
        .join(OrderItem, Order.id == OrderItem.order_id)
        .join(Product, OrderItem.product_id == Product.id)
        .filter(Product.farmer_id == farmer_id)
        .distinct()
        .all()
    )
    
    # Enrich orders with customer and product details
    enriched_orders = []
    for order in orders:
        # Get customer details
        customer = db.query(User).filter(User.id == order.user_id).first()
        
        # Get order items with product details
        order_items = (
            db.query(OrderItem, Product)
            .join(Product, OrderItem.product_id == Product.id)
            .filter(OrderItem.order_id == order.id)
            .filter(Product.farmer_id == farmer_id)  # Only this farmer's products
            .all()
        )
        
        items_list = []
        for order_item, product in order_items:
            items_list.append({
                "product_name": product.name,
                "quantity": order_item.quantity,
                "price": float(order_item.price),
                "subtotal": float(order_item.price * order_item.quantity)
            })
        
        enriched_orders.append({
            "id": order.id,
            "order_date": order.order_date,
            "status": order.status,
            "total_amount": float(order.total_amount),
            "delivery_address": order.delivery_address,
            "customer_name": customer.name if customer else "Unknown",
            "customer_email": customer.email if customer else "N/A",
            "user_id": order.user_id,
            "items": items_list
        })
    
    return enriched_orders




@router.put("/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, status_update: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status_update.status:
        order.status = status_update.status
        
    db.commit()
    db.refresh(order)
    return order
