from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import Finance
from app.schemas import FinanceCreate, FinanceUpdate, FinanceRead
from app.auth import require_role

router = APIRouter()

# 🔐 Только admin и superadmin могут просматривать
@router.get("/", response_model=list[FinanceRead])
async def get_all_finance(db: AsyncSession = Depends(get_db), user=Depends(require_role(["admin", "superadmin"]))):
    result = await db.execute(select(Finance))
    return result.scalars().all()


# 🔐 Только superadmin может добавить запись
@router.post("/", response_model=FinanceRead, status_code=201)
async def create_finance(
    data: FinanceCreate,
    db: AsyncSession = Depends(get_db),
    user=Depends(require_role(["superadmin"]))
):
    new_entry = Finance(**data.dict())
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    return new_entry


# 🔐 Только admin/superadmin может просматривать по ID
@router.get("/{finance_id}", response_model=FinanceRead)
async def get_finance_by_id(
    finance_id: int,
    db: AsyncSession = Depends(get_db),
    user=Depends(require_role(["admin", "superadmin"]))
):
    result = await db.execute(select(Finance).where(Finance.id == finance_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    return entry


# 🔐 Только superadmin может обновить
@router.put("/{finance_id}", response_model=FinanceRead)
async def update_finance(
    finance_id: int,
    data: FinanceUpdate,
    db: AsyncSession = Depends(get_db),
    user=Depends(require_role(["superadmin"]))
):
    result = await db.execute(select(Finance).where(Finance.id == finance_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    for field, value in data.dict().items():
        setattr(entry, field, value)

    await db.commit()
    await db.refresh(entry)
    return entry


# 🔐 Только superadmin может удалить
@router.delete("/{finance_id}", status_code=204)
async def delete_finance(
    finance_id: int,
    db: AsyncSession = Depends(get_db),
    user=Depends(require_role(["superadmin"]))
):
    result = await db.execute(select(Finance).where(Finance.id == finance_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")

    await db.delete(entry)
    await db.commit()
