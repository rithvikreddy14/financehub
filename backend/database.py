import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# If Render provides a Postgres URL, use it. Otherwise, fallback to local SQLite.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./finance.db")

# Fix a specific SQLAlchemy quirk if Render gives a 'postgres://' instead of 'postgresql://' URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False, Postgres does not.
if "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()