from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import Optional
from app.services.asset_service import AssetService
from app.services.transaction_service import TransactionService
from app.schemas.calculation import SummaryResponse, MonthlyResponse


class CalculationService:
    @staticmethod
    async def get_summary(db: AsyncSession, user_id: str) -> SummaryResponse:
        """전체 요약 계산 (총 자산, 총 부채, 순자산)"""
        total_assets = await AssetService.get_total_assets(db, user_id)
        total_liabilities = await AssetService.get_total_liabilities(db, user_id)
        net_worth = total_assets - total_liabilities

        return SummaryResponse(
            total_assets=total_assets,
            total_liabilities=total_liabilities,
            net_worth=net_worth,
        )

    @staticmethod
    async def get_monthly_summary(
        db: AsyncSession, user_id: str, year: Optional[int] = None, month: Optional[int] = None
    ) -> MonthlyResponse:
        """이번 달 수입/지출 합계"""
        now = datetime.now()
        target_year = year if year else now.year
        target_month = month if month else now.month

        total_income = await TransactionService.get_monthly_income(
            db, user_id, target_year, target_month
        )
        total_expense = await TransactionService.get_monthly_expense(
            db, user_id, target_year, target_month
        )

        return MonthlyResponse(
            total_income=total_income,
            total_expense=total_expense,
            month=target_month,
            year=target_year,
        )
