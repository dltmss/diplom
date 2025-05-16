from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import Equipment
from app.schemas import EquipmentCreate, EquipmentUpdate, EquipmentRead
from app.auth import require_role

router = APIRouter()

@router.get("/", response_model=list[EquipmentRead])
async def get_all_equipment(db: AsyncSession = Depends(get_db), user=Depends(require_role(["user", "admin", "superadmin"]))):
    result = await db.execute(select(Equipment))
    return result.scalars().all()


@router.post("/", response_model=EquipmentRead, status_code=201)
async def create_equipment(data: EquipmentCreate, db: AsyncSession = Depends(get_db), user=Depends(require_role(["user", "superadmin"]))):
    new_entry = Equipment(**data.dict())
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    return new_entry


@router.get("/{equipment_id}", response_model=EquipmentRead)
async def get_equipment_by_id(equipment_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_role(["user", "admin", "superadmin"]))):
    result = await db.execute(select(Equipment).where(Equipment.id == equipment_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Оборудование не найдено")
    return entry


@router.put("/{equipment_id}", response_model=EquipmentRead)
async def update_equipment(equipment_id: int, data: EquipmentUpdate, db: AsyncSession = Depends(get_db), user=Depends(require_role(["user", "superadmin"]))):
    result = await db.execute(select(Equipment).where(Equipment.id == equipment_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Оборудование не найдено")

    for field, value in data.dict().items():
        setattr(entry, field, value)

    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{equipment_id}", status_code=204)
async def delete_equipment(equipment_id: int, db: AsyncSession = Depends(get_db), user=Depends(require_role(["user", "superadmin"]))):
    result = await db.execute(select(Equipment).where(Equipment.id == equipment_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Оборудование не найдено")

    await db.delete(entry)
    await db.commit()
