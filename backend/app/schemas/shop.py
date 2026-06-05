from pydantic import BaseModel


class ShopCreate(BaseModel):
    name: str
    category_slug: str | None = None
    latitude: float
    longitude: float
    address: str | None = None
    phone: str | None = None
    image_url: str | None = None


class ShopUpdate(BaseModel):
    name: str | None = None
    category_slug: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    address: str | None = None
    phone: str | None = None
    image_url: str | None = None
    is_open: bool | None = None
    closing_time: str | None = None


class ShopOut(BaseModel):
    id: int
    name: str
    category: str | None = None
    category_name: str | None = None
    icon: str | None = None
    latitude: float
    longitude: float
    address: str | None = None
    phone: str | None = None
    image_url: str | None = None
    rating: float
    review_count: int
    is_open: bool
    closing_time: str | None = None
    distance: float | None = None

    model_config = {"from_attributes": True}
