from typing import List, Type

from sqlalchemy.orm import Session

from app.db.session import with_db_session

from app.models.project import Project
from app.models.sheet import Sheet
from app.schemas.sheet import CreateUpdateSheetRequest


@with_db_session
def get_sheets(db: Session) -> List[Type[Sheet]]:
    return db.query(Sheet).all()


@with_db_session
def get_sheets_available(db: Session) -> List[Sheet]:
    return (
        db.query(Sheet)
        .outerjoin(Project, Project.sheet_id == Sheet.id)
        .filter(Project.sheet_id.is_(None))
        .all()
    )

@with_db_session
def get_sheet_by_id(sheet_id, db: Session) -> Type[Sheet]:
    return db.query(Sheet).get(sheet_id)


@with_db_session
def create_sheet(sheet_data: CreateUpdateSheetRequest, db: Session) -> Sheet:
    sheet = Sheet(
        sheet_filename=sheet_data.sheet_filename,
        description=sheet_data.description,
        form_link=sheet_data.form_link,
        fill_form_status=True,
    )
    db.add(sheet)
    db.commit()
    db.refresh(sheet)

    return sheet


@with_db_session
def update_sheet(
    sheet_id: int, sheet_data: CreateUpdateSheetRequest, db: Session
) -> Type[Sheet]:
    sheet = get_sheet_by_id(sheet_id)
    sheet.sheet_filename = sheet_data.sheet_filename
    sheet.description = sheet_data.description
    sheet.form_link = sheet_data.form_link
    sheet.fill_form_status = sheet_data.fill_form_status

    db.add(sheet)
    db.commit()
    db.refresh(sheet)

    return sheet


@with_db_session
def delete_sheet(sheet_id, db: Session) -> Type[Sheet] | None:
    sheet = get_sheet_by_id(sheet_id)
    if sheet is None:
        return None

    db.delete(sheet)
    db.commit()

    return sheet
