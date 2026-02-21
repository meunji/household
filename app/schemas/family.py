from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional, List
from app.models.family import FamilyRole


class FamilyGroupCreate(BaseModel):
    """가족 그룹 생성 요청"""
    name: str = Field(..., min_length=1, max_length=100)


class FamilyGroupResponse(BaseModel):
    """가족 그룹 응답"""
    id: UUID
    name: str
    admin_user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FamilyMemberCreate(BaseModel):
    """가족 구성원 추가 요청"""
    email: str = Field(..., description="추가할 사용자의 이메일 주소 (구글 계정)")
    role: Optional[FamilyRole] = Field(FamilyRole.MEMBER, description="역할 (ADMIN 또는 MEMBER)")


class FamilyMemberResponse(BaseModel):
    """가족 구성원 응답"""
    id: UUID
    family_group_id: UUID
    user_id: str
    role: FamilyRole
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FamilyGroupDetailResponse(BaseModel):
    """가족 그룹 상세 응답 (구성원 포함)"""
    id: UUID
    name: str
    admin_user_id: str
    created_at: datetime
    updated_at: datetime
    members: List[FamilyMemberResponse]

    class Config:
        from_attributes = True
