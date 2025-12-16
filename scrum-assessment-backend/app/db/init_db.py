from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import engine
from app.models.role import Role
from app.models.user import User
from app.core.config import settings
from app.core.security import hash_password


def init_db():
    Base.metadata.create_all(bind=engine)

    # Create a session to insert seed data
    with Session(bind=engine) as db:
        # Check if roles already exist
        admin_role = None
        if not db.query(Role).first():
            admin_role = Role(role_name="ADMIN", description="Administrator")
            moderator_role = Role(
                role_name="MODERATOR", description="Moderator of a team"
            )
            db.add_all([admin_role, moderator_role])
            db.commit()

        # Optional: Seed an admin user
        if (
            not db.query(User)
            .filter(User.username == settings.MAIN_ADMIN.USERNAME)
            .first()
        ):
            admin_user = User(
                username=settings.MAIN_ADMIN.USERNAME,
                fullname=settings.MAIN_ADMIN.FULLNAME,
                role=admin_role,
                email=settings.MAIN_ADMIN.EMAIL,
                password=hash_password(settings.MAIN_ADMIN.PASSWORD),
            )
            db.add(admin_user)
            db.commit()
