from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class SheetSchema(BaseModel):
    id: int
    sheet_filename: str
    description: Optional[str]
    form_link: str
    fill_form_status: bool
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


class CreateUpdateSheetRequest(BaseModel):
    sheet_filename: str
    description: Optional[str]
    form_link: Optional[str]
    fill_form_status: Optional[bool]


class CreateSheetResponse(SheetSchema):
    pass
