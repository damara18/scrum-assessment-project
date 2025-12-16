from datetime import datetime, UTC

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.models.base_class import Base


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, onupdate=datetime.now(UTC))
    smm_data = Column(JSON, nullable=True)

    sheet_id = Column(Integer, ForeignKey("sheets.id"), unique=True, nullable=False)
    sheet = relationship("Sheet", back_populates="project", uselist=False)

    moderator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    moderator = relationship("User", back_populates="projects", uselist=False)
