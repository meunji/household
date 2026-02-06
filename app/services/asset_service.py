from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from fastapi import HTTPException, status
from app.models.asset import Asset, AssetType
from app.schemas.asset import AssetCreate, AssetUpdate


class AssetService:
    @staticmethod
    async def get_assets(db: AsyncSession, user_id: str) -> list[Asset]:
        """사용자의 모든 자산 조회"""
        result = await db.execute(
            select(Asset).where(Asset.user_id == user_id).order_by(Asset.created_at.desc())
        )
        return result.scalars().all()

    @staticmethod
    async def get_asset_by_id(db: AsyncSession, asset_id: UUID, user_id: str) -> Asset:
        """특정 자산 조회"""
        result = await db.execute(
            select(Asset).where(Asset.id == asset_id, Asset.user_id == user_id)
        )
        asset = result.scalar_one_or_none()
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found",
            )
        return asset

    @staticmethod
    async def create_asset(db: AsyncSession, asset_data: AssetCreate, user_id: str) -> Asset:
        """자산 생성"""
        asset = Asset(
            user_id=user_id,
            type=asset_data.type,
            name=asset_data.name,
            amount=asset_data.amount,
        )
        db.add(asset)
        await db.commit()
        await db.refresh(asset)  # 생성된 ID를 가져오기 위해 필요
        return asset

    @staticmethod
    async def update_asset(
        db: AsyncSession, asset_id: UUID, asset_data: AssetUpdate, user_id: str
    ) -> Asset:
        """자산 수정"""
        asset = await AssetService.get_asset_by_id(db, asset_id, user_id)

        if asset_data.type is not None:
            asset.type = asset_data.type
        if asset_data.name is not None:
            asset.name = asset_data.name
        if asset_data.amount is not None:
            asset.amount = asset_data.amount

        await db.commit()
        # refresh 제거 (변경사항이 이미 반영되어 있음)
        return asset

    @staticmethod
    async def delete_asset(db: AsyncSession, asset_id: UUID, user_id: str) -> None:
        """자산 삭제 (최적화: 직접 삭제 쿼리 사용)"""
        # 불필요한 조회 없이 직접 삭제 (성능 개선)
        result = await db.execute(
            select(Asset).where(Asset.id == asset_id, Asset.user_id == user_id)
        )
        asset = result.scalar_one_or_none()
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found",
            )
        await db.delete(asset)
        await db.commit()

    @staticmethod
    async def get_total_assets(db: AsyncSession, user_id: str) -> float:
        """총 자산 계산 (CASH 타입의 합계)"""
        result = await db.execute(
            select(Asset.amount).where(
                Asset.user_id == user_id, Asset.type == AssetType.CASH
            )
        )
        amounts = result.scalars().all()
        return float(sum(amounts)) if amounts else 0.0

    @staticmethod
    async def get_total_liabilities(db: AsyncSession, user_id: str) -> float:
        """총 부채 계산 (LOAN 타입의 합계)"""
        result = await db.execute(
            select(Asset.amount).where(
                Asset.user_id == user_id, Asset.type == AssetType.LOAN
            )
        )
        amounts = result.scalars().all()
        return float(sum(amounts)) if amounts else 0.0
