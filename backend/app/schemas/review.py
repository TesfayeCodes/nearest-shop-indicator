from pydantic import BaseModel


class ReviewCreate(BaseModel):
    rating: int
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    shop_id: int
    user_id: int
    user_name: str | None = None
    rating: int
    comment: str | None = None
    created_at: str | None = None

    model_config = {"from_attributes": True}
