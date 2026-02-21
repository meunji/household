from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from uuid import UUID
from app.models.family import FamilyGroup, FamilyMember, FamilyRole
from app.schemas.family import FamilyGroupCreate, FamilyMemberCreate
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class FamilyService:
    """가족 그룹 서비스"""

    @staticmethod
    async def create_family_group(
        db: AsyncSession,
        family_data: FamilyGroupCreate,
        admin_user_id: str,
    ) -> FamilyGroup:
        """가족 그룹 생성"""
        # 기존 가족 그룹 확인 (한 사용자는 하나의 가족 그룹만 관리 가능)
        existing_group = await db.execute(
            select(FamilyGroup).where(FamilyGroup.admin_user_id == admin_user_id)
        )
        if existing_group.scalar_one_or_none():
            raise ValueError("이미 관리하는 가족 그룹이 있습니다.")

        # 가족 그룹 생성
        family_group = FamilyGroup(
            name=family_data.name,
            admin_user_id=admin_user_id,
        )
        db.add(family_group)
        await db.flush()  # ID를 얻기 위해 flush

        # 관리자를 구성원으로 추가
        admin_member = FamilyMember(
            family_group_id=family_group.id,
            user_id=admin_user_id,
            role=FamilyRole.ADMIN,
        )
        db.add(admin_member)
        await db.commit()
        await db.refresh(family_group)

        return family_group

    @staticmethod
    async def get_family_group_by_admin(
        db: AsyncSession,
        admin_user_id: str,
    ) -> Optional[FamilyGroup]:
        """관리자 user_id로 가족 그룹 조회"""
        result = await db.execute(
            select(FamilyGroup)
            .where(FamilyGroup.admin_user_id == admin_user_id)
            .options(selectinload(FamilyGroup.members))
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_family_group_by_member(
        db: AsyncSession,
        user_id: str,
    ) -> Optional[FamilyGroup]:
        """구성원 user_id로 가족 그룹 조회"""
        result = await db.execute(
            select(FamilyGroup)
            .join(FamilyMember)
            .where(FamilyMember.user_id == user_id)
            .options(selectinload(FamilyGroup.members))
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def add_family_member(
        db: AsyncSession,
        family_group_id: UUID,
        member_data: FamilyMemberCreate,
        admin_user_id: str,
    ) -> FamilyMember:
        """가족 구성원 추가"""
        # 가족 그룹 확인 및 권한 확인
        family_group = await db.get(FamilyGroup, family_group_id)
        if not family_group:
            raise ValueError("가족 그룹을 찾을 수 없습니다.")
        if family_group.admin_user_id != admin_user_id:
            raise ValueError("가족 그룹 관리자만 구성원을 추가할 수 있습니다.")

        # 이미 구성원인지 확인
        existing_member = await db.execute(
            select(FamilyMember).where(
                and_(
                    FamilyMember.family_group_id == family_group_id,
                    FamilyMember.user_id == member_data.user_id,
                )
            )
        )
        if existing_member.scalar_one_or_none():
            raise ValueError("이미 가족 그룹 구성원입니다.")

        # 구성원 추가
        member = FamilyMember(
            family_group_id=family_group_id,
            user_id=member_data.user_id,
            role=member_data.role,
        )
        db.add(member)
        await db.commit()
        await db.refresh(member)

        return member

    @staticmethod
    async def remove_family_member(
        db: AsyncSession,
        family_group_id: UUID,
        member_user_id: str,
        admin_user_id: str,
    ) -> None:
        """가족 구성원 제거"""
        # 가족 그룹 확인 및 권한 확인
        family_group = await db.get(FamilyGroup, family_group_id)
        if not family_group:
            raise ValueError("가족 그룹을 찾을 수 없습니다.")
        if family_group.admin_user_id != admin_user_id:
            raise ValueError("가족 그룹 관리자만 구성원을 제거할 수 있습니다.")

        # 관리자는 제거할 수 없음
        if member_user_id == admin_user_id:
            raise ValueError("관리자는 가족 그룹에서 제거할 수 없습니다.")

        # 구성원 제거
        member = await db.execute(
            select(FamilyMember).where(
                and_(
                    FamilyMember.family_group_id == family_group_id,
                    FamilyMember.user_id == member_user_id,
                )
            )
        )
        member_obj = member.scalar_one_or_none()
        if not member_obj:
            raise ValueError("구성원을 찾을 수 없습니다.")

        await db.delete(member_obj)
        await db.commit()

    @staticmethod
    async def get_family_member_user_ids(
        db: AsyncSession,
        user_id: str,
    ) -> List[str]:
        """사용자가 속한 가족 그룹의 모든 구성원 user_id 목록 반환"""
        # 사용자가 속한 가족 그룹 찾기
        # 먼저 관리자로 관리하는 그룹 확인
        family_group = await FamilyService.get_family_group_by_admin(db, user_id)
        
        # 관리하는 그룹이 없으면 구성원으로 속한 그룹 확인
        if not family_group:
            family_group = await FamilyService.get_family_group_by_member(db, user_id)
        if not family_group:
            # 가족 그룹에 속하지 않으면 자신의 user_id만 반환
            return [user_id]

        # 가족 그룹의 모든 구성원 user_id 가져오기
        members = await db.execute(
            select(FamilyMember.user_id).where(
                FamilyMember.family_group_id == family_group.id
            )
        )
        user_ids = [row[0] for row in members.fetchall()]
        return user_ids if user_ids else [user_id]
