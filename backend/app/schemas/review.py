from pydantic import BaseModel


class ReviewCreate(BaseModel):
    shop_id: int
    rating: float
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    shop_id: int
    user_id: int
    rating: float
    comment: str | None

    model_config = {"from_attributes": True}
