from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from uuid import UUID
from app.models.family import FamilyGroup, FamilyMember, FamilyRole
from app.models.user import User
from app.schemas.family import FamilyGroupCreate, FamilyMemberCreate
from typing import List, Optional
import logging
from supabase import create_client, Client
from app.config import settings

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
        """가족 구성원 추가 (이메일로 사용자 찾기)"""
        # 가족 그룹 확인 및 권한 확인
        family_group = await db.get(FamilyGroup, family_group_id)
        if not family_group:
            raise ValueError("가족 그룹을 찾을 수 없습니다.")
        if family_group.admin_user_id != admin_user_id:
            raise ValueError("가족 그룹 관리자만 구성원을 추가할 수 있습니다.")

        # 이메일로 Supabase에서 user_id 찾기
        target_user_id = None
        
        if settings.supabase_service_key:
            try:
                # Supabase Admin API를 사용하여 이메일로 사용자 조회
                supabase_admin: Client = create_client(
                    settings.supabase_url,
                    settings.supabase_service_key  # Admin 권한이 있는 서비스 키 필요
                )
                
                # auth.users 테이블에서 이메일로 사용자 조회
                # list_users는 모든 사용자를 반환하거나 페이지네이션을 지원할 수 있음
                response = supabase_admin.auth.admin.list_users()
                target_user = None
                
                # response 구조 확인 및 사용자 찾기
                if response:
                    users_list = []
                    # response가 dict인 경우
                    if isinstance(response, dict) and 'users' in response:
                        users_list = response['users']
                    # response가 객체이고 users 속성이 있는 경우
                    elif hasattr(response, 'users'):
                        users_list = response.users if isinstance(response.users, list) else [response.users]
                    # response가 리스트인 경우
                    elif isinstance(response, list):
                        users_list = response
                    
                    for user in users_list:
                        # user가 dict인 경우
                        if isinstance(user, dict):
                            user_email = user.get('email', '')
                            user_id = user.get('id', '')
                        # user가 객체인 경우
                        else:
                            user_email = getattr(user, 'email', '') or ''
                            user_id = getattr(user, 'id', '') or ''
                        
                        if user_email and user_email.lower() == member_data.email.lower():
                            target_user = {'id': user_id, 'email': user_email}
                            break
                
                if not target_user:
                    raise ValueError(f"이메일 '{member_data.email}'로 등록된 사용자를 찾을 수 없습니다. 먼저 해당 이메일로 로그인해주세요.")
                
                # target_user가 dict인 경우 id 추출
                if isinstance(target_user, dict):
                    target_user_id = target_user['id']
                else:
                    target_user_id = getattr(target_user, 'id', None)
                
                if not target_user_id:
                    raise ValueError(f"사용자 ID를 찾을 수 없습니다.")
                
            except Exception as e:
                logger.error(f"Supabase에서 사용자 조회 실패: {str(e)}")
                raise ValueError(f"사용자를 찾는 중 오류가 발생했습니다: {str(e)}")
        else:
            # Service Key가 없으면 에러
            raise ValueError("서비스 키가 설정되지 않았습니다. Supabase Service Key를 설정해주세요.")

        # users 테이블에 사용자가 없으면 생성 (자동 생성)
        user_result = await db.execute(
            select(User).where(User.user_id == target_user_id)
        )
        user = user_result.scalar_one_or_none()
        if not user:
            # 사용자가 없으면 생성
            user = User(user_id=target_user_id)
            db.add(user)
            await db.flush()

        # 이미 구성원인지 확인
        existing_member = await db.execute(
            select(FamilyMember).where(
                and_(
                    FamilyMember.family_group_id == family_group_id,
                    FamilyMember.user_id == target_user_id,
                )
            )
        )
        if existing_member.scalar_one_or_none():
            raise ValueError("이미 가족 그룹 구성원입니다.")

        # 구성원 추가
        member = FamilyMember(
            family_group_id=family_group_id,
            user_id=target_user_id,
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

    @staticmethod
    async def get_user_email(user_id: str) -> Optional[str]:
        """user_id로 이메일 조회 (Supabase Admin API 사용)"""
        if not settings.supabase_service_key:
            return None
        
        try:
            supabase_admin: Client = create_client(
                settings.supabase_url,
                settings.supabase_service_key
            )
            
            # auth.users 테이블에서 user_id로 사용자 조회
            response = supabase_admin.auth.admin.list_users()
            
            if response:
                users_list = []
                # response가 dict인 경우
                if isinstance(response, dict) and 'users' in response:
                    users_list = response['users']
                # response가 객체이고 users 속성이 있는 경우
                elif hasattr(response, 'users'):
                    users_list = response.users if isinstance(response.users, list) else [response.users]
                # response가 리스트인 경우
                elif isinstance(response, list):
                    users_list = response
                
                for user in users_list:
                    # user가 dict인 경우
                    if isinstance(user, dict):
                        uid = user.get('id', '')
                        email = user.get('email', '')
                    # user가 객체인 경우
                    else:
                        uid = getattr(user, 'id', '') or ''
                        email = getattr(user, 'email', '') or ''
                    
                    if uid == user_id:
                        return email
        except Exception as e:
            logger.warning(f"이메일 조회 실패 (user_id: {user_id}): {str(e)}")
        
        return None
