# app/routers/logs.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import DataLog
from app.schemas import DataLogCreate, DataLogRead
from app.auth import get_current_user, require_role

router = APIRouter()


# 🔐 admin и superadmin могут смотреть все логи
@router.get(
    "/",
    response_model=list[DataLogRead],
    summary="Получить все логи (только admin и superadmin)",
)
async def get_logs(
    db: AsyncSession = Depends(get_db),
    user=Depends(require_role(["admin", "superadmin"])),
):
    """
    Возвращает список всех DataLog, сортированных от новых к старым.
    """
    result = await db.execute(select(DataLog).order_by(DataLog.id.desc()))
    return result.scalars().all()


# 🔐 любой авторизованный пользователь может создать запись лога
@router.post(
    "/",
    response_model=DataLogRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новую запись лога",
)
async def create_log(
    data: DataLogCreate,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Записывает новое событие в таблицу data_logs.
    Поля user_fullname и user_role берутся из текущего пользователя,
    created_at заполняется автоматически на уровне БД.
    """
    log = DataLog(
        user_id=user.id,
        user_fullname=user.fullname,
        user_role=user.role,          # ← добавляем роль
        action=data.action,
        parameter=data.parameter,
        file_name=data.file_name,
        # created_at заполняется DEFAULT now() автоматически
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


# 🔐 только superadmin может удалить одну запись
@router.delete(
    "/{log_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить одну запись лога (только superadmin)",
)
async def delete_log(
    log_id: int,
    db: AsyncSession = Depends(get_db),
    user=Depends(require_role(["superadmin"])),
):
    """
    Удаляет запись лога по её ID.
    """
    result = await db.execute(select(DataLog).where(DataLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Лог не найден")
    await db.delete(log)
    await db.commit()


# 🔐 только superadmin может очистить все логи
@router.delete(
    "/",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить все логи (только superadmin)",
)
async def delete_all_logs(
    db: AsyncSession = Depends(get_db),
    user=Depends(require_role(["superadmin"])),
):
    """
    Полностью очищает таблицу data_logs.
    """
    await db.execute(DataLog.__table__.delete())
    await db.commit()
