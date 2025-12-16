from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models import User
from app.schemas.user import (
    UserSchema,
)


router = APIRouter()


@router.get("/profile", response_model=UserSchema)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
