from typing import Type
from sqlalchemy.orm import Session

from app.models.role import Role
from app.db.session import with_db_session


@with_db_session
def get_role(role_name: str, db: Session) -> Type[Role] | None:
    return db.query(Role).filter(Role.role_name == role_name).first()
