from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.category import CategoryResponse
from app.services.category_service import CategoryService
from app.models.transaction import TransactionType

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
async def get_categories(
    type: TransactionType = Query(..., description="거래 유형 (INCOME 또는 EXPENSE)"),
    db: AsyncSession = Depends(get_db),
):
    """거래 유형별 카테고리 목록 조회"""
    categories = await CategoryService.get_categories(db, type)
    return categories


@router.get("/all", response_model=list[CategoryResponse])
async def get_all_categories(
    db: AsyncSession = Depends(get_db),
):
    """모든 카테고리 조회"""
    categories = await CategoryService.get_all_categories(db)
    return categories
