from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Products
from database import SessionLocal,engine
import database_models
import os

app = FastAPI()

# Add CORS middleware - configure for both development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development
        "http://localhost:5173",  # Vite development
        # Add your production frontend URL after deployment:
        # "https://your-app.vercel.app",
        # "https://your-app.netlify.app",
        os.getenv("FRONTEND_URL", "")  # Or use environment variable
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

products = [
    Products(id=1, name="Laptop", description="A high-performance laptop", price=999.99, quantity=10),
    Products(id=2, name="Smartphone", description="A latest model smartphone", price=499.99, quantity=20),
    Products(id=3, name="Headphones", description="Noise-cancelling headphones", price=199.99, quantity=15)
]
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
def init_db():
    db = SessionLocal()
    try:
        # Check if products already exist in the database
        existing_count = db.query(database_models.Products).count()
        if existing_count == 0:
            # Only add products if the table is empty
            for product in products:
                db_product = database_models.Products(
                    id=product.id,
                    name=product.name,
                    description=product.description,
                    price=product.price,
                    quantity=product.quantity
                )
                db.add(db_product)
            db.commit()
    finally:
        db.close()
init_db()

@app.get("/products")
def get_all_products(db = Depends(get_db)):
    return db.query(database_models.Products).all()

@app.get("/product/{product_id}")
def get_product(product_id:int, db = Depends(get_db)):
    product = db.query(database_models.Products).filter(database_models.Products.id == product_id).first()
    if product:
        return product
    return {"message": "Product not found"}

@app.post("/product")
def add_product(product: Products, db = Depends(get_db)):
    db_product = database_models.Products(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return {"message": "Product added successfully", "product": db_product}

@app.put("/product")
def update_product(product_id: int, updated_product: Products, db = Depends(get_db)):
    product = db.query(database_models.Products).filter(database_models.Products.id == product_id).first()
    if not product:
        return {"message": "Product not found"}
    for key, value in updated_product.dict(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return {"message": "Product updated successfully", "product": product}      

@app.delete("/product")
def delete_product(product_id: int, db = Depends(get_db)):
    product = db.query(database_models.Products).filter(database_models.Products.id == product_id).first()
    if not product:
        return {"message": "Product not found"}
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}