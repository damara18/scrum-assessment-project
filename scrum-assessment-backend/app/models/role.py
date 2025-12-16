from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.models.base_class import Base


class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String, unique=True, index=True)
    description = Column(String)

    users = relationship("User", back_populates="role")
