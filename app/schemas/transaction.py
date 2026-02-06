from pydantic import BaseModel, Field
from datetime import date, datetime
from uuid import UUID
from typing import Optional
from app.models.transaction import TransactionType
from app.schemas.category import CategoryResponse


class TransactionCreate(BaseModel):
    type: TransactionType
    amount: float = Field(..., gt=0)
    category_id: UUID  # 카테고리 ID
    date: date
    memo: Optional[str] = Field(None, max_length=500)


class TransactionUpdate(BaseModel):
    type: Optional[TransactionType] = None
    amount: Optional[float] = Field(None, gt=0)
    category_id: Optional[UUID] = None  # 카테고리 ID
    date: Optional[date] = None
    memo: Optional[str] = Field(None, max_length=500)


class TransactionResponse(BaseModel):
    id: UUID
    user_id: str
    type: TransactionType
    amount: float
    category_id: UUID
    category: CategoryResponse  # 카테고리 정보 포함
    date: date
    memo: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
