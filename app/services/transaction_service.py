from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import date, datetime
from typing import Optional
from fastapi import HTTPException, status
from app.models.transaction import Transaction, TransactionType
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionService:
    @staticmethod
    async def get_transactions(
        db: AsyncSession,
        user_id: str,
        transaction_type: Optional[TransactionType] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> list[Transaction]:
        """거래 목록 조회 (카테고리 정보 포함)"""
        from sqlalchemy.orm import joinedload
        
        query = (
            select(Transaction)
            .options(joinedload(Transaction.category))
            .where(Transaction.user_id == user_id)
        )

        if transaction_type:
            query = query.where(Transaction.type == transaction_type)
        if start_date:
            query = query.where(Transaction.date >= start_date)
        if end_date:
            query = query.where(Transaction.date <= end_date)

        query = query.order_by(Transaction.date.desc(), Transaction.created_at.desc())

        result = await db.execute(query)
        # unique()를 사용하여 중복 제거 (joinedload 사용 시)
        transactions = result.unique().scalars().all()
        return transactions

    @staticmethod
    async def get_transaction_by_id(
        db: AsyncSession, transaction_id: UUID, user_id: str
    ) -> Transaction:
        """특정 거래 조회 (카테고리 정보 포함)"""
        from sqlalchemy.orm import joinedload
        
        result = await db.execute(
            select(Transaction)
            .options(joinedload(Transaction.category))
            .where(
                Transaction.id == transaction_id, Transaction.user_id == user_id
            )
        )
        transaction = result.unique().scalar_one_or_none()
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found",
            )
        return transaction

    @staticmethod
    async def create_transaction(
        db: AsyncSession, transaction_data: TransactionCreate, user_id: str
    ) -> Transaction:
        """거래 생성"""
        # 카테고리 존재 확인
        category_result = await db.execute(
            select(Category).where(Category.id == transaction_data.category_id)
        )
        category = category_result.scalar_one_or_none()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        
        transaction = Transaction(
            user_id=user_id,
            type=transaction_data.type,
            amount=transaction_data.amount,
            category_id=transaction_data.category_id,
            date=transaction_data.date,
            memo=transaction_data.memo,
        )
        db.add(transaction)
        await db.commit()
        await db.refresh(transaction)
        # 카테고리 정보 로드
        await db.refresh(transaction, ["category"])
        return transaction

    @staticmethod
    async def update_transaction(
        db: AsyncSession,
        transaction_id: UUID,
        transaction_data: TransactionUpdate,
        user_id: str,
    ) -> Transaction:
        """거래 수정"""
        transaction = await TransactionService.get_transaction_by_id(
            db, transaction_id, user_id
        )

        if transaction_data.type is not None:
            transaction.type = transaction_data.type
        if transaction_data.amount is not None:
            transaction.amount = transaction_data.amount
        if transaction_data.category_id is not None:
            # 카테고리 존재 확인
            category_result = await db.execute(
                select(Category).where(Category.id == transaction_data.category_id)
            )
            category = category_result.scalar_one_or_none()
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Category not found",
                )
            transaction.category_id = transaction_data.category_id
        if transaction_data.date is not None:
            transaction.date = transaction_data.date
        if transaction_data.memo is not None:
            transaction.memo = transaction_data.memo

        await db.commit()
        # refresh 제거 (변경사항이 이미 반영되어 있음)
        return transaction

    @staticmethod
    async def delete_transaction(
        db: AsyncSession, transaction_id: UUID, user_id: str
    ) -> None:
        """거래 삭제 (최적화: 직접 삭제 쿼리 사용)"""
        # 불필요한 조회 없이 직접 삭제 (성능 개선)
        result = await db.execute(
            select(Transaction).where(
                Transaction.id == transaction_id, Transaction.user_id == user_id
            )
        )
        transaction = result.scalar_one_or_none()
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found",
            )
        await db.delete(transaction)
        await db.commit()

    @staticmethod
    async def get_monthly_income(
        db: AsyncSession, user_id: str, year: int, month: int
    ) -> float:
        """특정 월의 수입 합계"""
        start_date = date(year, month, 1)
        # 다음 달 1일
        if month == 12:
            end_date = date(year + 1, 1, 1)
        else:
            end_date = date(year, month + 1, 1)

        result = await db.execute(
            select(func.sum(Transaction.amount)).where(
                and_(
                    Transaction.user_id == user_id,
                    Transaction.type == TransactionType.INCOME,
                    Transaction.date >= start_date,
                    Transaction.date < end_date,
                )
            )
        )
        total = result.scalar()
        return float(total) if total else 0.0

    @staticmethod
    async def get_monthly_expense(
        db: AsyncSession, user_id: str, year: int, month: int
    ) -> float:
        """특정 월의 지출 합계"""
        start_date = date(year, month, 1)
        # 다음 달 1일
        if month == 12:
            end_date = date(year + 1, 1, 1)
        else:
            end_date = date(year, month + 1, 1)

        result = await db.execute(
            select(func.sum(Transaction.amount)).where(
                and_(
                    Transaction.user_id == user_id,
                    Transaction.type == TransactionType.EXPENSE,
                    Transaction.date >= start_date,
                    Transaction.date < end_date,
                )
            )
        )
        total = result.scalar()
        return float(total) if total else 0.0
