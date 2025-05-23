# app/main.py

from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware  # ✅ ДОБАВЛЕНО
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base
from app.routers import users, finance, equipment, logs
from app import models


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

origins = [
    "http://localhost:5173",  # адрес Vite (React frontend)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Разрешённые источники
    allow_credentials=True,
    allow_methods=["*"],            # Разрешены все методы (GET, POST и т.д.)
    allow_headers=["*"],            # Разрешены все заголовки
)

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
