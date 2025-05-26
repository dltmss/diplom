# src/schemas.py

from pydantic import BaseModel, EmailStr, constr
from typing import Optional, Dict, Any
from datetime import date, datetime


# ----------------------------------------
# Пользователь
# ----------------------------------------

class UserCreate(BaseModel):
    fullname: str
    email: EmailStr
    password: constr(min_length=6)
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None


class UserRead(BaseModel):
    id: int
    fullname: str
    email: EmailStr
    avatar_url: Optional[str]
    phone: Optional[str]
    role: str
    position: Optional[str]

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserAdminUpdate(BaseModel):
    role: Optional[str] = None
    position: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserUpdate(BaseModel):
    fullname: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: constr(min_length=6)
    new_password: constr(min_length=6)


# ----------------------------------------
# Финансы
# ----------------------------------------

class FinanceBase(BaseModel):
    date: date
    equipment_name: str
    energy: float
    effectiveness: float
    bcd_total: float
    income: int
    expense: int
    benefit: int


class FinanceCreate(FinanceBase):
    pass


class FinanceUpdate(FinanceBase):
    pass


class FinanceRead(FinanceBase):
    id: int

    class Config:
        orm_mode = True


# ----------------------------------------
# Оборудование / Мониторинг
# ----------------------------------------

class EquipmentBase(BaseModel):
    name: str
    date: date
    asic: int
    fan: int
    core: int
    memory: int
    disk: int
    energy_vt: int
    energy_kvt: int
    hashrate: int
    effectiveness: int
    uptime: int
    hw_error: int
    active: int


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(EquipmentBase):
    pass


class EquipmentRead(EquipmentBase):
    id: int

    class Config:
        orm_mode = True


# ----------------------------------------
# Логирование действий пользователя
# ----------------------------------------

class DataLogCreate(BaseModel):
    action: str
    parameter: Optional[Dict[str, Any]] = {}
    file_name: Optional[str] = None


class DataLogRead(BaseModel):
    id: int
    user_id: int
    user_fullname: str
    user_role: str
    action: str
    parameter: Optional[Dict[str, Any]]
    file_name: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
