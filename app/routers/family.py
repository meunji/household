from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.database import get_db
from app.dependencies import get_current_user_id
from app.services.family_service import FamilyService
from app.schemas.family import (
    FamilyGroupCreate,
    FamilyGroupResponse,
    FamilyMemberCreate,
    FamilyMemberResponse,
    FamilyGroupDetailResponse,
)

router = APIRouter(prefix="/api/family", tags=["family"])


@router.post("/groups", response_model=FamilyGroupResponse, status_code=status.HTTP_201_CREATED)
async def create_family_group(
    family_data: FamilyGroupCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """가족 그룹 생성"""
    try:
        family_group = await FamilyService.create_family_group(
            db, family_data, user_id
        )
        return family_group
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to create family group: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"데이터베이스 연결에 실패했습니다: {str(e)}",
        )


@router.get("/groups/my", response_model=FamilyGroupDetailResponse)
async def get_my_family_group(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """내가 속한 가족 그룹 조회"""
    try:
        # 관리자로 관리하는 그룹 먼저 확인
        family_group = await FamilyService.get_family_group_by_admin(
            db, user_id
        )
        
        # 관리하는 그룹이 없으면 구성원으로 속한 그룹 확인
        if not family_group:
            family_group = await FamilyService.get_family_group_by_member(
                db, user_id
            )
        
        if not family_group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="가족 그룹을 찾을 수 없습니다.",
            )
        
        return family_group
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to get family group: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"데이터베이스 연결에 실패했습니다: {str(e)}",
        )


@router.post("/groups/{family_group_id}/members", response_model=FamilyMemberResponse, status_code=status.HTTP_201_CREATED)
async def add_family_member(
    family_group_id: UUID,
    member_data: FamilyMemberCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """가족 구성원 추가"""
    try:
        member = await FamilyService.add_family_member(
            db, family_group_id, member_data, user_id
        )
        return member
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to add family member: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"데이터베이스 연결에 실패했습니다: {str(e)}",
        )


@router.delete("/groups/{family_group_id}/members/{member_user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_family_member(
    family_group_id: UUID,
    member_user_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """가족 구성원 제거"""
    try:
        await FamilyService.remove_family_member(
            db, family_group_id, member_user_id, user_id
        )
        return None
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to remove family member: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"데이터베이스 연결에 실패했습니다: {str(e)}",
        )
