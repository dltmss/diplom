# src/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import User
from app.schemas import (
    UserCreate,
    UserRead,
    UserLogin,
    Token,
    UserUpdate,
    PasswordChange,
    UserAdminUpdate,
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    require_role,
    get_current_user,
)
import os, shutil

router = APIRouter(tags=["Пайдаланушылар"])

@router.post("/register", response_model=UserRead)
async def register_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    new_user = User(
        fullname=user.fullname,
        email=user.email,
        password=hash_password(user.password),
        avatar_url=user.avatar_url,
        phone=user.phone,
        position=user.position,
        role="user",
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
async def login_user(
    user: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalar_one_or_none()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Email немесе құпиясөз қате"
        )

    access_token = create_access_token(
        {"sub": str(db_user.id), "role": db_user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get(
    "/admin-only",
    summary="Тек әкімшіге",
)
async def admin_page(
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    return {
        "message": f"Сәлеметсіз бе, {user.fullname}! Сізге қолжетімді."
    }


@router.patch("/me", response_model=UserRead)
async def update_me(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.put("/me/change-password", status_code=204)
async def change_password(
    data: PasswordChange,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.current_password, current_user.password):
        raise HTTPException(
            status_code=400,
            detail="Қазіргі құпиясөз дұрыс емес"
        )

    current_user.password = hash_password(data.new_password)
    await db.commit()


@router.post("/me/avatar", response_model=dict)
async def upload_avatar(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    filename = f"user_{current_user.id}.jpg"
    folder_path = "app/static/avatars"
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.avatar_url = f"/static/avatars/{filename}"
    db.add(current_user)
    await db.commit()

    return {"avatar_url": current_user.avatar_url}

# Получить всех пользователей (только для админа)
@router.get("/all", response_model=list[UserRead])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["admin", "superadmin"]))
):
    result = await db.execute(select(User))
    return result.scalars().all()


# Изменить роль и/или должность пользователя
@router.patch("/{user_id}/update-role", response_model=UserRead)
async def update_user_role_and_position(
    user_id: int,
    data: UserAdminUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(["admin", "superadmin"]))
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Пайдаланушы табылмады")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "superadmin"]))
):
    # ❌ Запрещаем удаление самого себя
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Өзіңізді жоюға болмайды"
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Пайдаланушы табылмады")

    await db.delete(user)
    await db.commit()
