from pydantic import BaseModel


class ShopCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    address: str | None = None


class ShopOut(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    address: str | None

    model_config = {"from_attributes": True}
