from typing import List

from sqlalchemy.orm import Session

from app.models.project import Project
from app.db.session import with_db_session
from app.schemas.project import CreateUpdateProjectRequest, ProjectSchema
from app.services.gsheet import (
    get_project_members,
    get_form_sheet,
    calculate_smm_score,
)


@with_db_session
def create_project(payload: CreateUpdateProjectRequest, db: Session) -> ProjectSchema:
    project = Project(
        name=payload.name,
        description=payload.description,
        moderator_id=payload.moderator_id,
        sheet_id=payload.sheet_id,
    )

    db.add(project)
    db.commit()

    return ProjectSchema.model_validate(project)


@with_db_session
def get_projects(db: Session) -> List[ProjectSchema]:
    projects = db.query(Project).all()
    return [ProjectSchema.model_validate(p) for p in projects]


@with_db_session
def get_project_by_id(project_id: int, db: Session) -> ProjectSchema:
    project = db.query(Project).filter(Project.id == project_id).first()
    return ProjectSchema.model_validate(project)


@with_db_session
def update_project(
    project_id: int, payload: CreateUpdateProjectRequest, db: Session
) -> ProjectSchema:
    project = db.query(Project).filter(Project.id == project_id).first()
    project.name = payload.name
    project.description = payload.description
    project.moderator_id = payload.moderator_id
    project.sheet_id = payload.sheet_id

    db.add(project)
    db.commit()
    return ProjectSchema.model_validate(project)


@with_db_session
def delete_project(project_id: int, db: Session) -> ProjectSchema:
    project = db.query(Project).filter(Project.id == project_id).first()
    db.delete(project)
    db.commit()
    return ProjectSchema.model_validate(project)


def get_project_detail(project_id: int):
    data = get_project_by_id(project_id).model_dump()
    scores = data.pop("smm_data")
    if scores is not None:
        return {**scores, "project_data": data}

    smm_scores = calculate_project_scores(project_id, return_data=True)

    return {**smm_scores, "project_data": data}


@with_db_session
def calculate_project_scores(
    project_id: int, return_data: bool = False, db: Session = None
):
    form_sheet = get_form_sheet(project_id)
    project_members = get_project_members(form_sheet)
    result = calculate_smm_score(form_sheet)

    data = {
        **result,
        "project_members": project_members,
    }

    project = db.query(Project).filter(Project.id == project_id).first()
    project.smm_data = data

    db.add(project)
    db.commit()

    if return_data:
        return data

    return True
