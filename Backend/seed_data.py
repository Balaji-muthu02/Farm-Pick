import sys
import os

# Add the Backend directory to the path so we can import from it
sys.path.append(os.path.join(os.getcwd(), 'Backend'))

from database.session import SessionLocal, engine, Base
from models.category import Category
from models.product import Product
from models.user import User
from models.farmer import Farmer

def seed():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("Seeding database...")
        
        # Clear existing data in correct order to handle FK constraints
        from models.order_item import OrderItem
        from models.order import Order
        from models.cart import Cart, CartItem
        from models.payment import Payment
        from models.contact_message import ContactMessage
        
        db.query(OrderItem).delete()
        db.query(Payment).delete()
        db.query(Order).delete()
        db.query(CartItem).delete()
        db.query(Cart).delete()
        db.query(ContactMessage).delete()
        
        # Clear farmer_id references first
        db.query(User).update({User.farmer_id: None})
        db.commit()
        
        db.query(Product).delete()
        db.query(Category).delete()
        db.query(Farmer).delete()
        db.query(User).delete()
        db.commit()

        # 1. Create a farmer record first
        farmer_record = Farmer(name="Admin Farmer", phone="1234567890", location="Green Valley", is_approved=True)
        db.add(farmer_record)
        db.commit()
        db.refresh(farmer_record)

        # 2. Create users
        test_user = User(name="Test User", email="test@example.com", password="password123", role="customer")
        admin_user = User(name="Admin Farmer", email="admin@farmpick.com", password="password123", role="farmer", farmer_id=farmer_record.id)
        
        db.add_all([test_user, admin_user])
        db.commit()
        db.refresh(admin_user)

        # Link farmer back to user
        farmer_record.user_id = admin_user.id
        db.commit()
        
        # 3. Create Categories
        veg = Category(name="Vegetables")
        fruits = Category(name="Fruits")
        db.add_all([veg, fruits])
        db.commit()
        db.refresh(veg)
        db.refresh(fruits)

        # 4. Create Products
        products = [
            Product(name="Fresh Tomatoes", description="Farm fresh organic red tomatoes", price=45.0, quantity=100, category_id=veg.id, farmer_id=farmer_record.id, image_url="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500"),
            Product(name="Organic Potatoes", description="Earth-grown organic brown potatoes", price=35.0, quantity=200, category_id=veg.id, farmer_id=farmer_record.id, image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500"),
            Product(name="Sweet Carrots", description="Crunchy and sweet organic carrots", price=55.0, quantity=150, category_id=veg.id, farmer_id=farmer_record.id, image_url="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500"),
            Product(name="Organic Eggs", description="Free-range farm organic eggs", price=120.0, quantity=50, category_id=veg.id, farmer_id=farmer_record.id, image_url="https://images.unsplash.com/photo-1582722472904-29727494f118?w=500"),
            Product(name="Organic Onion", description="Sharp and fresh organic red onions", price=40.0, quantity=300, category_id=veg.id, farmer_id=farmer_record.id, image_url="https://images.unsplash.com/photo-1508747703725-719777637510?w=500"),
            Product(name="Fresh Bell Peppers", description="Colorful and crunchy mix of bell peppers", price=90.0, quantity=80, category_id=veg.id, farmer_id=farmer_record.id, image_url="https://images.unsplash.com/photo-1566842600175-97dca489844f?w=500")
        ]
        db.add_all(products)
        db.commit()

        print("Seeding completed successfully!")
        print("Test User: test@example.com / password123")
        print("Farmer User: admin@farmpick.com / password123")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
