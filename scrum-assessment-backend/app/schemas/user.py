from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.schemas.role import Role


class ChangeRoleRequest(BaseModel):
    role: str


class RegisterUserRequest(BaseModel):
    username: str
    email: str
    password: str
    fullname: Optional[str] = None


class UpdateUserRequest(BaseModel):
    username: str
    email: str
    fullname: Optional[str] = None
    role: Optional[str] = None


class CreateUserRequest(UpdateUserRequest):
    password: str


class LoginUserRequest(BaseModel):
    username_or_email: str
    password: str


class UserSchema(BaseModel):
    id: int
    email: str
    username: str
    email: str
    fullname: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    role: Optional[Role] = None

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
