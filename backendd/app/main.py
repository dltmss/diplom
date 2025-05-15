from fastapi import FastAPI
from app.database import init_db
from app.routers.health import router as health_router

app = FastAPI(title="Diploma API", version="0.1.0")

@app.on_event("startup")
async def on_startup():
    # создаём таблицы при старте
    await init_db()

# вешаем роутер
app.include_router(health_router, prefix="", tags=["health"])
