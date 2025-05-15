import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Загружаем .env
load_dotenv()

# Получаем строку подключения из .env
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не задан в .env")

# Создаём асинхронный движок
engine = create_async_engine(DATABASE_URL, echo=True)

# Фабрика AsyncSession
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Новый способ объявлять базовый класс (SQLAlchemy-2.0)
class Base(DeclarativeBase):
    pass

async def init_db():
    """Создаёт все таблицы из моделей."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
