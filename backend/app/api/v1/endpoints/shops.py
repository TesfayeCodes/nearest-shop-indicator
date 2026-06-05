from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.deps import get_current_admin, get_current_user, get_db
from app.models.category import Category
from app.models.favorite import Favorite
from app.models.review import Review
from app.models.shop import Shop
from app.models.user import User
from app.schemas.review import ReviewCreate
from app.schemas.shop import ShopCreate, ShopUpdate
from app.services.geo import haversine

router = APIRouter()


@router.get("", response_model=dict)
async def list_shops(
    category: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Shop).options(joinedload(Shop.category))

    if category:
        cat_query = await db.execute(select(Category).where(Category.slug == category))
        cat = cat_query.scalar_one_or_none()
        if cat:
            query = query.where(Shop.category_id == cat.id)

    if search:
        query = query.where(Shop.name.ilike(f"%{search}%"))

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar()

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Shop.name)
    result = await db.execute(query)
    shops = result.scalars().unique().all()

    items = []
    for s in shops:
        d = {
            "id": s.id,
            "name": s.name,
            "category": s.category.slug if s.category else None,
            "category_name": s.category.name if s.category else None,
            "icon": s.category.icon if s.category else None,
            "latitude": s.latitude,
            "longitude": s.longitude,
            "address": s.address,
            "phone": s.phone,
            "image_url": s.image_url,
            "rating": s.rating,
            "review_count": s.review_count,
            "is_open": s.is_open,
            "closing_time": s.closing_time,
        }
        items.append(d)

    return {"items": items, "total": total, "page": page, "page_size": page_size}


@router.get("/nearby", response_model=dict)
async def nearby_shops(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(5.0),
    category: str | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    query = select(Shop).options(joinedload(Shop.category))

    if category:
        cat_query = await db.execute(select(Category).where(Category.slug == category))
        cat = cat_query.scalar_one_or_none()
        if cat:
            query = query.where(Shop.category_id == cat.id)

    result = await db.execute(query)
    all_shops = result.scalars().unique().all()

    nearby = []
    for s in all_shops:
        dist = haversine(lat, lng, s.latitude, s.longitude)
        if dist <= radius:
            d = {
                "id": s.id,
                "name": s.name,
                "category": s.category.slug if s.category else None,
                "category_name": s.category.name if s.category else None,
                "icon": s.category.icon if s.category else None,
                "latitude": s.latitude,
                "longitude": s.longitude,
                "address": s.address,
                "phone": s.phone,
                "image_url": s.image_url,
                "rating": s.rating,
                "review_count": s.review_count,
                "is_open": s.is_open,
                "closing_time": s.closing_time,
                "distance": round(dist, 2),
            }
            nearby.append(d)

    nearby.sort(key=lambda x: x["distance"])
    nearby = nearby[:limit]

    return {"items": nearby, "total": len(nearby)}


@router.get("/categories", response_model=list)
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.name))
    cats = result.scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "icon": c.icon,
            "description": c.description,
        }
        for c in cats
    ]


@router.get("/favorites", response_model=dict)
async def get_user_favorites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Favorite)
        .where(Favorite.user_id == current_user.id)
        .options(joinedload(Favorite.shop).joinedload(Shop.category))
    )
    favs = result.scalars().unique().all()

    items = []
    for f in favs:
        s = f.shop
        items.append(
            {
                "id": s.id,
                "name": s.name,
                "category": s.category.slug if s.category else None,
                "icon": s.category.icon if s.category else None,
                "latitude": s.latitude,
                "longitude": s.longitude,
                "rating": s.rating,
                "is_open": s.is_open,
            }
        )

    return {"items": items, "total": len(items)}


@router.get("/{shop_id}", response_model=dict)
async def get_shop(
    shop_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Shop).options(joinedload(Shop.category)).where(Shop.id == shop_id)
    )
    s = result.scalar_one_or_none()
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shop not found",
        )

    return {
        "id": s.id,
        "name": s.name,
        "category": s.category.slug if s.category else None,
        "category_name": s.category.name if s.category else None,
        "icon": s.category.icon if s.category else None,
        "latitude": s.latitude,
        "longitude": s.longitude,
        "address": s.address,
        "phone": s.phone,
        "image_url": s.image_url,
        "rating": s.rating,
        "review_count": s.review_count,
        "is_open": s.is_open,
        "closing_time": s.closing_time,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_shop(
    data: ShopCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.category_slug:
        cat_result = await db.execute(
            select(Category).where(Category.slug == data.category_slug)
        )
        cat = cat_result.scalar_one_or_none()
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category '{data.category_slug}' not found",
            )
        category_id = cat.id
    else:
        category_id = None

    shop = Shop(
        name=data.name,
        category_id=category_id,
        latitude=data.latitude,
        longitude=data.longitude,
        address=data.address,
        phone=data.phone,
        image_url=data.image_url,
    )
    db.add(shop)
    await db.commit()
    await db.refresh(shop)

    return {"id": shop.id, "name": shop.name}


@router.put("/{shop_id}", response_model=dict)
async def update_shop(
    shop_id: int,
    data: ShopUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Shop).where(Shop.id == shop_id))
    shop = result.scalar_one_or_none()
    if not shop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shop not found",
        )

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(shop, key, value)

    await db.commit()
    await db.refresh(shop)
    return {"id": shop.id, "name": shop.name, "message": "Shop updated"}


@router.delete("/{shop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shop(
    shop_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = await db.execute(select(Shop).where(Shop.id == shop_id))
    shop = result.scalar_one_or_none()
    if not shop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shop not found",
        )
    await db.delete(shop)
    await db.commit()


@router.post("/{shop_id}/favorite", response_model=dict)
async def toggle_favorite(
    shop_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shop_result = await db.execute(select(Shop).where(Shop.id == shop_id))
    if not shop_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shop not found",
        )

    fav_result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.shop_id == shop_id,
        )
    )
    existing = fav_result.scalar_one_or_none()

    if existing:
        await db.delete(existing)
        await db.commit()
        return {"favorited": False}
    else:
        fav = Favorite(user_id=current_user.id, shop_id=shop_id)
        db.add(fav)
        await db.commit()
        return {"favorited": True}


@router.post(
    "/{shop_id}/reviews", response_model=dict, status_code=status.HTTP_201_CREATED
)
async def create_review(
    shop_id: int,
    data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shop_result = await db.execute(select(Shop).where(Shop.id == shop_id))
    shop = shop_result.scalar_one_or_none()
    if not shop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shop not found",
        )

    review = Review(
        shop_id=shop_id,
        user_id=current_user.id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    await db.flush()

    stats = await db.execute(
        select(
            func.count(Review.id),
            func.avg(Review.rating),
        ).where(Review.shop_id == shop_id)
    )
    count, avg = stats.one()
    shop.review_count = count
    shop.rating = round(avg, 1) if avg else 0.0

    await db.commit()
    await db.refresh(review)

    return {
        "id": review.id,
        "rating": review.rating,
        "comment": review.comment,
        "user_id": review.user_id,
        "created_at": review.created_at.isoformat() if review.created_at else None,
    }


@router.get("/{shop_id}/reviews", response_model=dict)
async def list_reviews(
    shop_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    shop_result = await db.execute(select(Shop).where(Shop.id == shop_id))
    if not shop_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shop not found",
        )

    query = (
        select(Review)
        .where(Review.shop_id == shop_id)
        .options(joinedload(Review.user))
        .order_by(Review.created_at.desc())
    )

    total_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(total_query)
    total = total_result.scalar()

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)
    result = await db.execute(query)
    reviews = result.scalars().unique().all()

    items = []
    for r in reviews:
        items.append(
            {
                "id": r.id,
                "rating": r.rating,
                "comment": r.comment,
                "user_id": r.user_id,
                "user_name": r.user.full_name if r.user else None,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
        )

    return {"items": items, "total": total, "page": page, "page_size": page_size}
