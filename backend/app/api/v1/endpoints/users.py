from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_admin, get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter()


@router.get("", response_model=dict)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    total_query = select(func.count()).select_from(select(User).subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar()

    offset = (page - 1) * page_size
    result = await db.execute(
        select(User).offset(offset).limit(page_size).order_by(User.created_at.desc())
    )
    users = result.scalars().all()

    items = []
    for u in users:
        items.append(
            {
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "is_active": u.is_active,
                "is_admin": u.is_admin,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
        )

    return {"items": items, "total": total, "page": page, "page_size": page_size}


@router.get("/{user_id}", response_model=dict)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "is_admin": user.is_admin,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.patch("/{user_id}", response_model=dict)
async def update_user(
    user_id: int,
    full_name: str | None = None,
    is_active: bool | None = None,
    is_admin: bool | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if full_name is not None:
        user.full_name = full_name
    if is_active is not None:
        user.is_active = is_active
    if is_admin is not None:
        user.is_admin = is_admin

    await db.commit()
    await db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "is_admin": user.is_admin,
    }


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_active = False
    await db.commit()
