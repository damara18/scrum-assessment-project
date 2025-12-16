import json

import sqlalchemy
from fastapi.security import OAuth2PasswordRequestForm

from app.core.exceptions import InvalidCredentialsException
from app.schemas.user import (
    RegisterUserRequest,
    LoginResponse,
    UserSchema,
    CreateUserRequest,
)
from app.services.role import get_role
from app.services.user import get_user_by_username_or_email, create_user
from app.core.security import hash_password, verify_password, create_access_token


def login_user(form_data: OAuth2PasswordRequestForm) -> LoginResponse:
    user = get_user_by_username_or_email(form_data.username)

    if not user or not verify_password(form_data.password, user.password):
        raise InvalidCredentialsException("Wrong username, email or password")

    token = create_access_token(
        {
            "sub": json.dumps(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role_id,
                }
            )
        }
    )
    return LoginResponse(access_token=token, token_type="bearer")


def register_user(
    payload: RegisterUserRequest | CreateUserRequest, role_name: str = None
) -> UserSchema:
    try:
        role = get_role(role_name)
        user = create_user(
            username=payload.username,
            email=payload.email,
            fullname=payload.fullname,
            password=hash_password(payload.password),
            role=role,
        )
    except sqlalchemy.exc.IntegrityError:
        raise InvalidCredentialsException("Username or email already exists")

    return UserSchema.model_validate(user)
