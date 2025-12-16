from typing import List, Type
from sqlalchemy.sql import or_
from sqlalchemy.orm import Session, joinedload

from app.models import Role
from app.models.user import User
from app.db.session import with_db_session
from app.services.role import get_role


@with_db_session
def get_user_by_username_or_email(username_or_email: str, db: Session) -> User | None:
    user = (
        db.query(User)
        .filter(
            or_(
                User.email == username_or_email,
                User.username == username_or_email,
            )
        )
        .options(joinedload(User.role))
        .first()
    )

    return user


@with_db_session
def get_user_by_id(user_id: int, db: Session) -> User | None:
    user = (
        db.query(User).filter(User.id == user_id).options(joinedload(User.role)).first()
    )

    return user


@with_db_session
def get_user_by_role(role_id: int, db: Session) -> User | None:
    user = (
        db.query(User)
        .filter(User.role_id == role_id)
        .options(joinedload(User.role))
        .all()
    )

    return user


@with_db_session
def get_users(db: Session) -> List[User] | None:
    return db.query(User).options(joinedload(User.role)).all()


@with_db_session
def create_user(
    username: str,
    email: str,
    fullname: str,
    password: str,
    role: Role,
    db: Session,
) -> Type[User] | None:
    user = User(
        username=username,
        email=email,
        fullname=fullname,
        password=password,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Reload user with role eagerly loaded
    user_with_role = (
        db.query(User).options(joinedload(User.role)).filter(User.id == user.id).first()
    )
    return user_with_role


@with_db_session
def update_user(
    user_id: int,
    username: str,
    email: str,
    fullname: str,
    role: str,
    db: Session,
) -> Type[User] | None:
    user = get_user_by_id(user_id)
    role = get_role(role)
    user.username = username
    user.email = email
    user.fullname = fullname
    user.role_id = role.id

    db.add(user)
    db.commit()
    db.refresh(user)

    user_with_role = (
        db.query(User).options(joinedload(User.role)).filter(User.id == user.id).first()
    )
    return user_with_role


@with_db_session
def update_user_role(
    user_id: int,
    role: str,
    db: Session,
) -> Type[Role] | None:
    user = get_user_by_id(user_id)
    role = get_role(role)
    user.role_id = role.id

    db.add(user)
    db.commit()
    db.refresh(user)

    return role


@with_db_session
def delete_user(user_id: int, db: Session) -> User | None:
    user = get_user_by_id(user_id)
    if user is None:
        return None

    db.delete(user)
    db.commit()

    return user
