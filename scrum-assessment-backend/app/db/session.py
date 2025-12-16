from functools import wraps
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def with_db_session(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        db = SessionLocal()
        try:
            return func(*args, db=db, **kwargs)
        finally:
            db.close()

    return wrapper
