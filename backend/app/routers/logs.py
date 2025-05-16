from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import DataLog
from app.schemas import DataLogCreate, DataLogRead
from app.auth import get_current_user, require_role

router = APIRouter()

# 🔐 admin и superadmin могут смотреть
@router.get("/", response_model=list[DataLogRead])
async def get_logs(db: AsyncSession = Depends(get_db), user=Depends(require_role(["admin", "superadmin"]))):
    result = await db.execute(select(DataLog).order_by(DataLog.id.desc()))
    return result.scalars().all()


# 🔐 все авторизованные могут создать
@router.post("/", response_model=DataLogRead, status_code=201)
async def create_log(
    data: DataLogCreate,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    log = DataLog(
        user_id=user.id,
        user_fullname=user.fullname,
        action=data.action,
        parameter=data.parameter,
        file_name=data.file_name
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


# 🔐 только superadmin может удалить по ID
@router.delete("/{log_id}", status_code=204)
async def delete_log(log_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_role(["superadmin"]))):
    result = await db.execute(select(DataLog).where(DataLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Лог не найден")
    await db.delete(log)
    await db.commit()


# 🔐 только superadmin может удалить все
@router.delete("/", status_code=204)
async def delete_all_logs(db: AsyncSession = Depends(get_db), user=Depends(require_role(["superadmin"]))):
    await db.execute(DataLog.__table__.delete())
    await db.commit()
