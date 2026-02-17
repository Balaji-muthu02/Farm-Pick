import sys
import os
from sqlalchemy import text

# Add the Backend directory to the path
sys.path.append(os.path.join(os.getcwd(), 'Backend'))

from database.session import engine, Base
from models import * # Import all models

def reset_db():
    print("Dropping all tables with CASCADE...")
    with engine.connect() as conn:
        # Get all table names from metadata
        tables = Base.metadata.sorted_tables
        for table in reversed(tables):
            print(f"Dropping {table.name}...")
            conn.execute(text(f"DROP TABLE IF EXISTS {table.name} CASCADE"))
        conn.commit()
    
    print("Recreating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database reset successfully!")

if __name__ == "__main__":
    reset_db()
