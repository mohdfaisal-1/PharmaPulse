import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Read DATABASE_URL from environment or default to local SQLite database
# Supported Dialect Examples:
# - PostgreSQL: postgresql+psycopg2://user:password@localhost:5432/pharmapulse_db
# - MySQL:      mysql+pymysql://user:password@localhost:3306/pharmapulse_db
# - SQLite:     sqlite:///./pharmapulse.db (Fallback)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pharmapulse.db")

# Configure engine parameters depending on the database dialect
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs = {
        "connect_args": {"check_same_thread": False}
    }
else:
    # Standard connection pooling for PostgreSQL / MySQL
    engine_kwargs = {
        "pool_pre_ping": True,
        "pool_size": 10,
        "max_overflow": 20
    }

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency generator for FastAPI database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

