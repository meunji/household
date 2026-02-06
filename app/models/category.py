from sqlalchemy import Column, String, Integer, Enum as SQLEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from app.database import Base
from app.models.transaction import TransactionType


class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(SQLEnum(TransactionType), nullable=False, index=True)  # INCOME or EXPENSE
    name = Column(String, nullable=False)  # 카테고리 이름 (예: 월급, 외식)
    display_order = Column(Integer, nullable=False, default=0)  # 표시 순서

    # 관계 설정 (선택사항)
    # transactions = relationship("Transaction", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, type={self.type}, name={self.name})>"
