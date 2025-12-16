from datetime import datetime, UTC

from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.orm import relationship

from app.models.base_class import Base


class Sheet(Base):
    __tablename__ = "sheets"
    id = Column(Integer, primary_key=True, index=True)
    sheet_filename = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    form_link = Column(String, nullable=False)
    fill_form_status = Column(Boolean, nullable=True, default=False)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, onupdate=datetime.now(UTC))

    project = relationship("Project", back_populates="sheet", uselist=False)
