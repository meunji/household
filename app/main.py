from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.routers import assets, transactions, calculations, categories, family
import traceback
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 시작 시 환경 변수 확인
try:
    from app.config import settings
    logger.info("환경 변수 확인:")
    logger.info(f"  DATABASE_URL: {'설정됨' if settings.database_url else '누락됨'}")
    logger.info(f"  SUPABASE_URL: {'설정됨' if settings.supabase_url else '누락됨'}")
    logger.info(f"  SUPABASE_KEY: {'설정됨' if settings.supabase_key else '누락됨'}")
    logger.info(f"  SUPABASE_SERVICE_KEY: {'설정됨' if settings.supabase_service_key else '누락됨 (선택사항)'}")
    logger.info(f"  ENVIRONMENT: {settings.environment}")
except Exception as e:
    logger.error(f"환경 변수 로드 실패: {e}")
    raise

app = FastAPI(
    title="가족 자산관리 및 가계부 API",
    description="FastAPI 기반 가족 자산관리 및 가계부 앱의 MVP 백엔드",
    version="1.0.0",
)

# CORS 설정
# 환경 변수에서 허용할 origin 목록 가져오기 (쉼표로 구분)
import os
from app.config import settings

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    # GitHub Pages (프로덕션)
    "https://meunji.github.io",
]

# 환경 변수에서 추가 origin 가져오기 (배포 환경용)
if os.getenv("ALLOWED_ORIGINS"):
    additional_origins = [
        origin.strip() for origin in os.getenv("ALLOWED_ORIGINS").split(",")
        if origin.strip() and origin.strip() not in allowed_origins
    ]
    allowed_origins.extend(additional_origins)

logger.info(f"CORS 허용된 origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 전역 예외 핸들러
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """모든 예외를 처리하는 전역 핸들러"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": str(exc),
            "type": type(exc).__name__,
            "traceback": traceback.format_exc() if app.debug else None,
        },
    )

# 라우터 등록
app.include_router(assets.router)
app.include_router(transactions.router)
app.include_router(calculations.router)
app.include_router(categories.router)
app.include_router(family.router)


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "가족 자산관리 및 가계부 API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy"}
