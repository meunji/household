from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.asset import AssetType


class AssetCreate(BaseModel):
    type: AssetType
    name: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)


class AssetUpdate(BaseModel):
    type: Optional[AssetType] = None
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    amount: Optional[float] = Field(None, gt=0)


class AssetResponse(BaseModel):
    id: UUID
    user_id: str
    type: AssetType
    name: str
    amount: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
