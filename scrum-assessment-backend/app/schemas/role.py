from typing import Optional

from pydantic import BaseModel, ConfigDict


class Role(BaseModel):
    id: int
    role_name: str
    description: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )
