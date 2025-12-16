from typing import List

from fastapi import APIRouter, Depends

from app.core.exceptions import DataNotFoundException
from app.schemas.project import ProjectSchema, CreateUpdateProjectRequest
from app.schemas.role import Role
from app.schemas.sheet import SheetSchema, CreateUpdateSheetRequest
from app.schemas.user import (
    RegisterUserRequest,
    UserSchema,
    UpdateUserRequest,
    ChangeRoleRequest,
    CreateUserRequest,
)
from app.core.dependencies import admin_only
from app.services import (
    auth as auth_service,
    user as user_service,
    role as role_service,
    sheet as sheet_service,
    project as project_service,
)

router = APIRouter(dependencies=[Depends(admin_only)])


@router.post("/create-admin", response_model=UserSchema)
def create_admin(payload: RegisterUserRequest):
    user = auth_service.register_user(payload, "ADMIN")
    return user


@router.post("/create-moderator", response_model=UserSchema)
def create_moderator(payload: RegisterUserRequest):
    user = auth_service.register_user(payload, "MODERATOR")
    return user


@router.get("/users", response_model=List[UserSchema])
def get_users():
    return user_service.get_users()


@router.post("/users", response_model=UserSchema)
def create_user(payload: CreateUserRequest):
    role = payload.role.upper()
    user = auth_service.register_user(payload, role)

    return user


@router.get("/users/{user_id}", response_model=UserSchema)
def get_user_by_id(user_id: int):
    return user_service.get_user_by_id(user_id)


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(payload: UpdateUserRequest, user_id: int):
    return user_service.update_user(
        user_id, payload.username, payload.email, payload.fullname, payload.role.upper()
    )


@router.delete("/users/{user_id}", response_model=UserSchema)
def delete_user(user_id: int):
    user = user_service.delete_user(user_id)
    if user is None:
        raise DataNotFoundException(entity_name="user")

    return user


@router.get("/moderators", response_model=List[UserSchema])
def get_moderators():
    role = role_service.get_role("MODERATOR")
    return user_service.get_user_by_role(role.id)


@router.patch("/users/{user_id}/role", response_model=Role)
def update_role(payload: ChangeRoleRequest, user_id: int):
    return user_service.update_user_role(user_id, payload.role.upper())


@router.post("/sheets", response_model=SheetSchema)
def create_sheet(payload: CreateUpdateSheetRequest):
    return sheet_service.create_sheet(payload)


@router.get("/sheets", response_model=List[SheetSchema])
def get_sheets():
    return sheet_service.get_sheets()


@router.get("/sheets/available", response_model=List[SheetSchema])
def get_sheets_available():
    return sheet_service.get_sheets_available()


@router.get("/sheets/{sheet_id}", response_model=SheetSchema)
def get_sheet(sheet_id: int):
    sheet = sheet_service.get_sheet_by_id(sheet_id)
    if sheet is None:
        raise DataNotFoundException(entity_name="sheet")

    return sheet


@router.put("/sheets/{sheet_id}", response_model=SheetSchema)
def update_sheet(sheet_id: int, sheet: CreateUpdateSheetRequest):
    return sheet_service.update_sheet(sheet_id, sheet)


@router.delete("/sheets/{sheet_id}", response_model=SheetSchema)
def delete_sheet(sheet_id: int):
    sheet = sheet_service.delete_sheet(sheet_id)
    if sheet is None:
        raise DataNotFoundException(entity_name="sheet")

    return sheet


@router.post("/projects", response_model=ProjectSchema)
def create_project(payload: CreateUpdateProjectRequest):
    project = project_service.create_project(payload)
    return project


@router.get("/projects", response_model=List[ProjectSchema])
def get_projects():
    return project_service.get_projects()


@router.get("/projects/{project_id}", response_model=ProjectSchema)
def get_project(project_id: int):
    return project_service.get_project_by_id(project_id)


@router.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(project_id: int, project: CreateUpdateProjectRequest):
    return project_service.update_project(project_id, project)


@router.delete("/projects/{project_id}", response_model=ProjectSchema)
def delete_project(project_id: int):
    project = project_service.delete_project(project_id)
    if project is None:
        raise DataNotFoundException(entity_name="project")
    return project


@router.get("/projects/{project_id}/detail")
def get_project_detail(project_id: int):
    return project_service.get_project_detail(project_id)


@router.get("/projects/{project_id}/calculate-scores")
def calculate_project_scores(project_id: int):
    return project_service.calculate_project_scores(project_id)
