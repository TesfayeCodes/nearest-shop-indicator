from sqlalchemy.orm import Session
from app.models.shop import Shop
from app.services.location_service import haversine_distance
from app.core.config import settings
from app.schemas.shop_schema import ShopResponse


def find_nearest_shops(
    db: Session,
    lat: float,
    lng: float,
    radius_km: float | None = None,
    limit: int | None = None,
) -> list[dict]:
    radius = radius_km or settings.DEFAULT_RADIUS_KM
    max_results = limit or settings.MAX_RESULTS

    shops = db.query(Shop).filter(Shop.is_open == True).all()

    results = []
    for shop in shops:
        distance = haversine_distance(lat, lng, shop.latitude, shop.longitude)
        if distance <= radius:
            results.append(
                {
                    "shop": shop,
                    "distance_km": round(distance, 3),
                }
            )

    results.sort(key=lambda x: x["distance_km"])
    return results[:max_results]


def create_shop(
    db: Session,
    name: str,
    latitude: float,
    longitude: float,
    description: str | None = None,
    address: str | None = None,
    shop_type: str | None = None,
    category: str | None = None,
    is_open: bool = True,
) -> Shop:
    shop = Shop(
        name=name,
        latitude=latitude,
        longitude=longitude,
        description=description,
        address=address,
        shop_type=shop_type,
        category=category,
        is_open=is_open,
    )
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return shop


def get_all_shops(db: Session, skip: int = 0, limit: int = 100) -> list[Shop]:
    return db.query(Shop).offset(skip).limit(limit).all()
