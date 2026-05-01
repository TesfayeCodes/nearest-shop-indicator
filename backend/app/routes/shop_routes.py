from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.services.shop_service import find_nearest_shops, create_shop
from app.schemas.shop_schema import ShopResponse, NearestShopsResponse

router = APIRouter(prefix="/shops", tags=["shops"])


@router.get("/nearest", response_model=NearestShopsResponse)
def get_nearest_shops(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lng: float = Query(..., ge=-180, le=180, description="Longitude"),
    radius: float = Query(
        default=50.0, gt=0, description="Search radius in kilometers"
    ),
    limit: int = Query(
        default=20, gt=0, le=100, description="Maximum number of results"
    ),
    db: Session = Depends(get_db),
):
    results = find_nearest_shops(db, lat, lng, radius_km=radius, limit=limit)

    shops = []
    for item in results:
        shop_data = ShopResponse.model_validate(item["shop"])
        shop_data.distance_km = item["distance_km"]
        shops.append(shop_data)

    return NearestShopsResponse(
        latitude=lat,
        longitude=lng,
        radius_km=radius,
        total_found=len(shops),
        shops=shops,
    )


@router.post("/", response_model=ShopResponse, status_code=201)
def create_new_shop(
    name: str = Query(..., min_length=1, max_length=255),
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    description: str | None = Query(None, max_length=500),
    address: str | None = Query(None, max_length=500),
    shop_type: str | None = Query(None, max_length=100),
    is_open: bool = Query(True),
    db: Session = Depends(get_db),
):
    try:
        shop = create_shop(
            db=db,
            name=name,
            latitude=latitude,
            longitude=longitude,
            description=description,
            address=address,
            shop_type=shop_type,
            is_open=is_open,
        )
        return shop
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
