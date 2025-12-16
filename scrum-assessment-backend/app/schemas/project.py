from dataclasses import Field
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.sheet import SheetSchema
from app.schemas.user import UserSchema


class ProjectSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime]
    smm_data: Optional[dict] = None
    moderator: Optional[UserSchema] = None
    sheet: Optional[SheetSchema] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class CreateUpdateProjectRequest(BaseModel):
    name: str
    description: Optional[str] = None
    sheet_id: int
    moderator_id: int
