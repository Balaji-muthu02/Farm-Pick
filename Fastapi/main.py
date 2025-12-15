from fastapi import FastAPI
from data_base.session import engine, Base
from routers import home, shop
from routers import cart
from routers import seller
from routers import farmer_product

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(home.router)
app.include_router(shop.router)
app.include_router(cart.router)
app.include_router(seller.router)
app.include_router(farmer_product.router)



