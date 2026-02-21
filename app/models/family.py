from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from app.database import Base


class FamilyRole(str, enum.Enum):
    """가족 그룹 내 역할"""
    ADMIN = "ADMIN"  # 관리자
    MEMBER = "MEMBER"  # 일반 구성원


class FamilyGroup(Base):
    """가족 그룹"""
    __tablename__ = "family_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)  # 가족 그룹 이름 (예: "아은이네")
    admin_user_id = Column(String, ForeignKey("users.user_id"), nullable=False, index=True)  # 관리자 user_id
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # 관계 설정
    members = relationship("FamilyMember", back_populates="family_group", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<FamilyGroup(id={self.id}, name={self.name}, admin_user_id={self.admin_user_id})>"


class FamilyMember(Base):
    """가족 그룹 구성원"""
    __tablename__ = "family_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    family_group_id = Column(UUID(as_uuid=True), ForeignKey("family_groups.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False, index=True)
    role = Column(SQLEnum(FamilyRole), nullable=False, default=FamilyRole.MEMBER)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # 관계 설정
    family_group = relationship("FamilyGroup", back_populates="members")

    def __repr__(self):
        return f"<FamilyMember(id={self.id}, family_group_id={self.family_group_id}, user_id={self.user_id}, role={self.role})>"
