from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import date
from typing import Optional
from app.database import get_db
from app.dependencies import get_current_user_id
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
)
from app.models.transaction import TransactionType
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionResponse])
async def get_transactions(
    transaction_type: Optional[TransactionType] = Query(None, description="거래 유형 필터"),
    start_date: Optional[date] = Query(None, description="시작 날짜"),
    end_date: Optional[date] = Query(None, description="종료 날짜"),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """거래 목록 조회"""
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        transactions = await TransactionService.get_transactions(
            db, user_id, transaction_type, start_date, end_date
        )
        return transactions
    except Exception as e:
        logger.error(f"Failed to get transactions: {str(e)}", exc_info=True)
        # 데이터베이스 연결 실패 시 빈 배열 반환 (MVP 수준)
        return []


@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    transaction_data: TransactionCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """거래 등록"""
    import logging
    from fastapi import HTTPException, status
    logger = logging.getLogger(__name__)
    
    try:
        transaction = await TransactionService.create_transaction(
            db, transaction_data, user_id
        )
        return transaction
    except Exception as e:
        logger.error(f"Failed to create transaction: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"데이터베이스 연결에 실패했습니다: {str(e)}",
        )


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: UUID,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """거래 상세 조회"""
    transaction = await TransactionService.get_transaction_by_id(
        db, transaction_id, user_id
    )
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: UUID,
    transaction_data: TransactionUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """거래 수정"""
    transaction = await TransactionService.update_transaction(
        db, transaction_id, transaction_data, user_id
    )
    return transaction


@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(
    transaction_id: UUID,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """거래 삭제"""
    await TransactionService.delete_transaction(db, transaction_id, user_id)
    return None
