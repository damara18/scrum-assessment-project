from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user import (
    RegisterUserRequest,
    UserSchema,
    LoginResponse,
)
from app.services.auth import login_user, register_user

router = APIRouter()


@router.post("/register", response_model=UserSchema)
def register(payload: RegisterUserRequest):
    return register_user(payload)


@router.post("/login", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return login_user(form_data)
