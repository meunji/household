from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings
import logging
import ssl

logger = logging.getLogger(__name__)

# SSL 컨텍스트 설정
# Connection Pooler 사용 시 인증서 검증 완화 (개발 환경)
# 프로덕션에서는 인증서 검증을 유지하는 것이 좋습니다
ssl_context = ssl.create_default_context()
if settings.environment == "development":
    # 개발 환경: Connection Pooler 인증서 검증 완화
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

# 비동기 엔진 생성
# 성능 최적화: 연결 풀링 활성화 및 타임아웃 설정
engine = create_async_engine(
    settings.database_url,
    echo=settings.environment == "development",
    future=True,
    # 연결 풀링 활성화 (성능 개선)
    pool_size=5,  # 기본 연결 풀 크기
    max_overflow=10,  # 추가 연결 허용
    pool_timeout=30,  # 풀에서 연결 가져올 때 타임아웃 (초)
    pool_recycle=3600,  # 연결 재사용 시간 (1시간)
    connect_args={
        "ssl": ssl_context,  # SSL 컨텍스트 사용
        "server_settings": {
            "application_name": "household_app",
        },
        # 연결 타임아웃 설정 (초 단위)
        "command_timeout": 10,
    },
    # pool_pre_ping 제거 (성능 오버헤드 감소)
    # 필요시 자동으로 연결 재생성됨
)

# 세션 팩토리 생성
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


# 데이터베이스 세션 의존성
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
