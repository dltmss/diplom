# app/main.py

from fastapi import FastAPI
from app.database import engine, Base
from app.routers import users
from app import models
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi
from app.routers import finance
from app.routers import equipment
from app.routers import logs

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

app = FastAPI()

# Роутеры
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(finance.router, prefix="/finance", tags=["Finance"])
app.include_router(equipment.router, prefix="/equipment", tags=["Equipment"])
app.include_router(logs.router, prefix="/logs", tags=["Data Logs"])

@app.get("/")
async def root():
    return {"message": "FastAPI + asyncpg работает!"}

# Создание таблиц при старте
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Diplom API",
        version="1.0.0",
        description="Авторизация через Bearer токен",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi