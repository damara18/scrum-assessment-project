import json

from jose import JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

from app.models.user import User
from app.core.security import decode_access_token
from app.schemas.user import UserSchema
from app.services.auth import get_user_by_username_or_email


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")  # or /token


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        user = json.loads(payload.get("sub"))
        username = user.get("username")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_username_or_email(username)
    if user is None:
        raise credentials_exception

    return user


def admin_only(token: str = Depends(oauth2_scheme)) -> UserSchema | None:
    user = get_current_user(token)
    user = UserSchema.model_validate(user)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    if user.role is None or user.role.role_name != "ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return user
