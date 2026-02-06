from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.category import Category
from app.models.transaction import TransactionType


class CategoryService:
    @staticmethod
    async def get_categories(
        db: AsyncSession, transaction_type: TransactionType
    ) -> list[Category]:
        """거래 유형별 카테고리 목록 조회"""
        result = await db.execute(
            select(Category)
            .where(Category.type == transaction_type)
            .order_by(Category.display_order, Category.name)
        )
        return result.scalars().all()

    @staticmethod
    async def get_all_categories(db: AsyncSession) -> list[Category]:
        """모든 카테고리 조회"""
        result = await db.execute(
            select(Category).order_by(Category.type, Category.display_order, Category.name)
        )
        return result.scalars().all()
