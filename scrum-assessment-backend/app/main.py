from http import HTTPStatus
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, admin, user
from app.core.config import settings
from app.core.exceptions import InvalidCredentialsException, DataNotFoundException

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(user.router, prefix="/api/v1/user", tags=["user"])

origins = [
    "http://localhost:5173",  # React Vite dev
    # Add more origins if needed, e.g. deployed frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Or ["*"] to allow all origins (less secure)
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],  # Authorization, Content-Type, etc.
)


@app.exception_handler(DataNotFoundException)
async def data_not_found_handler(_: Request, exc: DataNotFoundException):
    return JSONResponse(
        status_code=HTTPStatus.NOT_FOUND,
        content={"error": {"detail": exc.detail, "entity_name": exc.entity_name}},
    )


@app.exception_handler(InvalidCredentialsException)
async def invalid_credentials_handler(_: Request, exc: InvalidCredentialsException):
    return JSONResponse(
        status_code=HTTPStatus.UNAUTHORIZED,
        content={"error": exc.detail},
    )


@app.get("/")
def root():
    return {"message": "Hello World"}
