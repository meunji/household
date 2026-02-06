# 문서 디렉토리

이 디렉토리에는 프로젝트 관련 상세 문서들이 포함되어 있습니다.

## 문서 목록

### 데이터베이스 관련

- **[데이터베이스 마이그레이션 가이드](README_MIGRATION.md)**
  - 데이터베이스 스키마 생성 방법
  - Alembic 사용법
  - Supabase 대시보드에서 직접 SQL 실행 방법

- **[데이터베이스 연결 문제 해결](TROUBLESHOOTING_DB.md)**
  - WSL2 네트워크 연결 오류 해결
  - 연결 테스트 방법
  - 대안 해결책

- **[Supabase 연결 설정](SUPABASE_DB_CONNECTION.md)**
  - Supabase 대시보드에서 연결 문자열 가져오기
  - Connection Pooler 설정
  - .env 파일 업데이트 방법

### 프론트엔드 관련

- **[Google OAuth 설정](../frontend/GOOGLE_OAUTH_SETUP.md)**
  - Google Cloud Console 설정
  - Supabase OAuth 설정
  - redirect_uri_mismatch 오류 해결

## 빠른 참조

### 데이터베이스 마이그레이션
```bash
# Supabase 대시보드에서 실행
sql/init_schema.sql
sql/migration_add_categories.sql
```

### 연결 테스트
```bash
python3 test_db_connection.py
```

### 백엔드 서버 실행
```bash
uvicorn app.main:app --reload
```

### 프론트엔드 실행
```bash
cd frontend && npm run dev
```
