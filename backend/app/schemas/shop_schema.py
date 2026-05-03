from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ShopBase(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    shop_type: Optional[str] = None
    category: Optional[str] = None
    is_open: bool = True


class ShopCreate(ShopBase):
    pass


class ShopResponse(ShopBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    distance_km: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class NearestShopsResponse(BaseModel):
    latitude: float
    longitude: float
    radius_km: float
    total_found: int
    shops: list[ShopResponse]
