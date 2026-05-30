from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.shop import Shop
from app.schemas.shop import ShopCreate


async def create_shop(db: AsyncSession, data: ShopCreate) -> Shop:
    shop = Shop(**data.model_dump())
    db.add(shop)
    await db.commit()
    await db.refresh(shop)
    return shop


async def get_shops_near(
    db: AsyncSession, lat: float, lon: float, radius_km: float
) -> list[Shop]:
    result = await db.execute(select(Shop))
    shops = result.scalars().all()
    from app.services.geo import haversine

    return [
        s for s in shops if haversine(lat, lon, s.latitude, s.longitude) <= radius_km
    ]
