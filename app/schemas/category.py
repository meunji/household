from pydantic import BaseModel
from uuid import UUID
from app.models.transaction import TransactionType


class CategoryResponse(BaseModel):
    id: UUID
    type: TransactionType
    name: str
    display_order: int

    class Config:
        from_attributes = True
