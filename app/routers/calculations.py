from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.database import get_db
from app.dependencies import get_current_user_id
from app.schemas.calculation import SummaryResponse, MonthlyResponse
from app.services.calculation_service import CalculationService

router = APIRouter(prefix="/api/calculations", tags=["calculations"])


@router.get("/summary", response_model=SummaryResponse)
async def get_summary(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """전체 요약 조회 (총 자산, 총 부채, 순자산)"""
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        summary = await CalculationService.get_summary(db, user_id)
        return summary
    except Exception as e:
        logger.error(f"Failed to get summary: {str(e)}", exc_info=True)
        # 데이터베이스 연결 실패 시 빈 응답 반환 (MVP 수준)
        return SummaryResponse(
            total_assets=0.0,
            total_liabilities=0.0,
            net_worth=0.0,
        )


@router.get("/monthly", response_model=MonthlyResponse)
async def get_monthly_summary(
    year: Optional[int] = Query(None, description="연도 (기본값: 현재 연도)"),
    month: Optional[int] = Query(None, ge=1, le=12, description="월 (기본값: 현재 월)"),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """이번 달 수입/지출 합계"""
    import logging
    from datetime import datetime
    logger = logging.getLogger(__name__)
    
    try:
        monthly_summary = await CalculationService.get_monthly_summary(
            db, user_id, year, month
        )
        return monthly_summary
    except Exception as e:
        logger.error(f"Failed to get monthly summary: {str(e)}", exc_info=True)
        # 데이터베이스 연결 실패 시 빈 응답 반환 (MVP 수준)
        now = datetime.now()
        target_year = year if year else now.year
        target_month = month if month else now.month
        return MonthlyResponse(
            total_income=0.0,
            total_expense=0.0,
            month=target_month,
            year=target_year,
        )
