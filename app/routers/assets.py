from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.database import get_db
from app.dependencies import get_current_user_id
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse
from app.services.asset_service import AssetService

router = APIRouter(prefix="/api/assets", tags=["assets"])


@router.get("", response_model=list[AssetResponse])
async def get_assets(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """자산 목록 조회"""
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        assets = await AssetService.get_assets(db, user_id)
        return assets
    except Exception as e:
        logger.error(f"Failed to get assets: {str(e)}", exc_info=True)
        # 데이터베이스 연결 실패 시 빈 배열 반환 (MVP 수준)
        return []


@router.post("", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
async def create_asset(
    asset_data: AssetCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """자산 등록"""
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        asset = await AssetService.create_asset(db, asset_data, user_id)
        return asset
    except Exception as e:
        logger.error(f"Failed to create asset: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"데이터베이스 연결에 실패했습니다: {str(e)}",
        )


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(
    asset_id: UUID,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """자산 상세 조회"""
    asset = await AssetService.get_asset_by_id(db, asset_id, user_id)
    return asset


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: UUID,
    asset_data: AssetUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """자산 수정"""
    asset = await AssetService.update_asset(db, asset_id, asset_data, user_id)
    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: UUID,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """자산 삭제"""
    await AssetService.delete_asset(db, asset_id, user_id)
    return None
