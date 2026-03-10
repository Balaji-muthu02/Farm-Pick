import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'Backend'))
from database.session import SessionLocal
from models.product import Product

db = SessionLocal()
products = db.query(Product).all()
print(f"Total products in DB: {len(products)}")
for p in products:
    print(f"- {p.name} (ID: {p.id})")
db.close()
