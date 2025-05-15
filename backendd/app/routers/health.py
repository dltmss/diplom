from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.crud import get_user, create_user

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/")
async def health():
    return {"status": "ok", "message": "API is running"}

@router.get("/users/{user_id}")
async def read_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users/")
async def add_user(username: str, full_name: str = "", db: AsyncSession = Depends(get_db)):
    return await create_user(db, username, full_name)
