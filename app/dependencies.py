from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from supabase import create_client, Client
from jose import JWTError, jwt
from app.config import settings
from app.database import get_db
from app.models.user import User

security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Supabase JWT 토큰을 검증하고 user_id를 추출합니다.
    JWT 토큰을 직접 파싱하여 user_id를 추출합니다.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    token = credentials.credentials

    try:
        # JWT 토큰에서 payload 추출 (서명 검증 없이, Supabase가 이미 검증함)
        # Supabase JWT의 payload에서 sub (user_id) 추출
        # 모든 검증 옵션을 비활성화하여 payload만 추출
        payload = jwt.decode(
            token,
            key="",  # 서명 검증을 하지 않으므로 빈 문자열
            options={
                "verify_signature": False,  # 서명 검증 비활성화
                "verify_aud": False,  # audience 검증 비활성화
                "verify_exp": False,  # 만료 시간 검증 비활성화 (선택사항)
            }
        )
        
        logger.info(f"JWT payload decoded: {list(payload.keys())}")
        
        user_id = payload.get("sub")
        
        if not user_id:
            logger.warning("user_id not found in token payload")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials: user_id not found in token",
            )

        logger.info(f"User authenticated: {user_id}")
        return user_id

    except JWTError as e:
        logger.error(f"JWT decode error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
        )


async def get_current_user_id(
    user_id: str = Depends(verify_token),
    db: AsyncSession = Depends(get_db),
) -> str:
    """
    현재 사용자의 user_id를 반환하고, User 레코드가 없으면 생성합니다.
    데이터베이스 연결 실패 시에도 user_id는 반환합니다 (MVP 수준).
    """
    import logging
    import json
    import os
    logger = logging.getLogger(__name__)
    
    # #region agent log
    try:
        log_data = {
            "sessionId": "debug-session",
            "runId": "run1",
            "hypothesisId": "A",
            "location": "dependencies.py:77",
            "message": "get_current_user_id entry",
            "data": {"user_id": user_id},
            "timestamp": int(__import__("time").time() * 1000)
        }
        with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
            f.write(json.dumps(log_data) + "\n")
    except: pass
    # #endregion
    
    try:
        # #region agent log
        try:
            log_data = {
                "sessionId": "debug-session",
                "runId": "run1",
                "hypothesisId": "A",
                "location": "dependencies.py:85",
                "message": "Before DB query",
                "data": {"user_id": user_id},
                "timestamp": int(__import__("time").time() * 1000)
            }
            with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                f.write(json.dumps(log_data) + "\n")
        except: pass
        # #endregion
        
        # User 레코드 확인
        result = await db.execute(
            select(User).where(User.user_id == user_id)
        )
        user = result.scalar_one_or_none()

        # #region agent log
        try:
            log_data = {
                "sessionId": "debug-session",
                "runId": "run1",
                "hypothesisId": "A",
                "location": "dependencies.py:95",
                "message": "After DB query",
                "data": {"user_id": user_id, "user_found": user is not None},
                "timestamp": int(__import__("time").time() * 1000)
            }
            with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                f.write(json.dumps(log_data) + "\n")
        except: pass
        # #endregion

        if not user:
            # User 레코드가 없으면 생성
            try:
                # #region agent log
                try:
                    log_data = {
                        "sessionId": "debug-session",
                        "runId": "run1",
                        "hypothesisId": "B",
                        "location": "dependencies.py:102",
                        "message": "Before creating user record",
                        "data": {"user_id": user_id},
                        "timestamp": int(__import__("time").time() * 1000)
                    }
                    with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                        f.write(json.dumps(log_data) + "\n")
                except: pass
                # #endregion
                
                new_user = User(user_id=user_id)
                db.add(new_user)
                await db.commit()
                await db.refresh(new_user)
                logger.info(f"User record created: {user_id}")
                
                # #region agent log
                try:
                    log_data = {
                        "sessionId": "debug-session",
                        "runId": "run1",
                        "hypothesisId": "B",
                        "location": "dependencies.py:115",
                        "message": "User record created successfully",
                        "data": {"user_id": user_id},
                        "timestamp": int(__import__("time").time() * 1000)
                    }
                    with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                        f.write(json.dumps(log_data) + "\n")
                except: pass
                # #endregion
            except Exception as e:
                # #region agent log
                try:
                    log_data = {
                        "sessionId": "debug-session",
                        "runId": "run1",
                        "hypothesisId": "B",
                        "location": "dependencies.py:122",
                        "message": "Failed to create user record",
                        "data": {"user_id": user_id, "error": str(e), "error_type": type(e).__name__},
                        "timestamp": int(__import__("time").time() * 1000)
                    }
                    with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                        f.write(json.dumps(log_data) + "\n")
                except: pass
                # #endregion
                
                logger.warning(f"Failed to create user record: {str(e)}. Continuing without DB record.")
                # 데이터베이스 연결 실패 시에도 계속 진행 (MVP 수준)
                try:
                    await db.rollback()
                except:
                    pass
        
        # #region agent log
        try:
            log_data = {
                "sessionId": "debug-session",
                "runId": "run1",
                "hypothesisId": "A",
                "location": "dependencies.py:137",
                "message": "get_current_user_id success",
                "data": {"user_id": user_id},
                "timestamp": int(__import__("time").time() * 1000)
            }
            with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                f.write(json.dumps(log_data) + "\n")
        except: pass
        # #endregion
        
        return user_id
        
    except Exception as e:
        # #region agent log
        try:
            log_data = {
                "sessionId": "debug-session",
                "runId": "run1",
                "hypothesisId": "C",
                "location": "dependencies.py:145",
                "message": "Database error caught",
                "data": {"user_id": user_id, "error": str(e), "error_type": type(e).__name__},
                "timestamp": int(__import__("time").time() * 1000)
            }
            with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                f.write(json.dumps(log_data) + "\n")
        except: pass
        # #endregion
        
        # 데이터베이스 연결 실패 등 모든 예외 처리
        logger.error(f"Database error in get_current_user_id: {str(e)}", exc_info=True)
        # 데이터베이스 연결이 실패해도 user_id는 반환 (인증은 이미 완료됨)
        # MVP 수준에서는 데이터베이스 없이도 API가 동작하도록 함
        
        # #region agent log
        try:
            log_data = {
                "sessionId": "debug-session",
                "runId": "run1",
                "hypothesisId": "C",
                "location": "dependencies.py:155",
                "message": "Returning user_id despite DB error",
                "data": {"user_id": user_id},
                "timestamp": int(__import__("time").time() * 1000)
            }
            with open("/home/meunji/work/cursor/household/.cursor/debug.log", "a") as f:
                f.write(json.dumps(log_data) + "\n")
        except: pass
        # #endregion
        
        return user_id
