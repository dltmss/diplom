from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User

async def get_user(db: AsyncSession, user_id: int) -> User | None:
    q = await db.execute(select(User).where(User.id == user_id))
    return q.scalar_one_or_none()

async def create_user(db: AsyncSession, username: str, full_name: str = "") -> User:
    user = User(username=username, full_name=full_name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
