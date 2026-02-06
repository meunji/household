# Supabase 데이터베이스 연결 설정 가이드

## Supabase 대시보드에서 연결 문자열 가져오기

### 1. Supabase 대시보드 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택 (fqgcxjddhddcrbazuseu)

### 2. 데이터베이스 연결 문자열 확인
1. 왼쪽 메뉴에서 **Settings** (⚙️) 클릭
2. **Database** 섹션 클릭
3. **Connection string** 섹션으로 스크롤

### 3. 연결 모드 선택

Supabase는 두 가지 연결 모드를 제공합니다:

#### 옵션 A: 직접 연결 (Direct Connection) - 포트 5432
- **장점**: asyncpg와 완전 호환, 모든 PostgreSQL 기능 사용 가능
- **단점**: 연결 수 제한 (Supabase 무료 플랜: 최대 60개 동시 연결)
- **권장**: 개발 환경, asyncpg 사용 시

**연결 문자열 형식:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.fqgcxjddhddcrbazuseu.supabase.co:5432/postgres
```

#### 옵션 B: Connection Pooler - 포트 6543
- **장점**: 더 많은 동시 연결 지원, 서버리스 환경에 적합
- **단점**: asyncpg와 호환성 문제 (Transaction 모드), 일부 기능 제한
- **권장**: 프로덕션 환경, 서버리스 배포

**연결 문자열 형식 (Transaction 모드):**
```
postgresql://postgres.fqgcxjddhddcrbazuseu:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

**연결 문자열 형식 (Session 모드):**
```
postgresql://postgres.fqgcxjddhddcrbazuseu:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
```

### 4. 연결 문자열 복사
1. 원하는 연결 모드 선택 (URI 또는 JDBC)
2. **URI** 형식 선택 (Python/SQLAlchemy 사용 시)
3. **Copy** 버튼 클릭

## .env 파일 업데이트

### 현재 설정 확인
`.env` 파일에서 `DATABASE_URL`을 확인하고 업데이트하세요.

### 직접 연결 사용 (권장 - asyncpg 호환)

```bash
# .env 파일
DATABASE_URL=postgresql+asyncpg://postgres:wlq261820%211@db.fqgcxjddhddcrbazuseu.supabase.co:5432/postgres
```

**참고**: 비밀번호의 특수문자 `!`는 URL 인코딩하여 `%21`로 변환해야 합니다.

### Connection Pooler 사용 (Session 모드)

```bash
# .env 파일
DATABASE_URL=postgresql+asyncpg://postgres.fqgcxjddhddcrbazuseu:wlq261820%211@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
```

**중요**: 
- 사용자명이 `postgres.fqgcxjddhddcrbazuseu` 형식으로 변경됩니다 (프로젝트 참조 포함)
- 포트는 5432 (Session 모드) 또는 6543 (Transaction 모드)
- Transaction 모드(6543)는 asyncpg와 호환성 문제가 있을 수 있습니다

## 연결 테스트

설정 변경 후 연결을 테스트하세요:

```bash
cd /home/meunji/work/cursor/household
source house_venv/bin/activate
python3 test_db_connection.py
```

## 문제 해결

### 연결 실패 시 확인 사항

1. **비밀번호 URL 인코딩 확인**
   - `!` → `%21`
   - `@` → `%40`
   - `#` → `%23`
   - 기타 특수문자도 URL 인코딩 필요

2. **포트 번호 확인**
   - 직접 연결: 5432
   - Pooler Session: 5432
   - Pooler Transaction: 6543

3. **호스트 주소 확인**
   - 직접 연결: `db.fqgcxjddhddcrbazuseu.supabase.co`
   - Pooler: `aws-0-ap-northeast-2.pooler.supabase.com` (리전에 따라 다름)

4. **사용자명 확인**
   - 직접 연결: `postgres`
   - Pooler: `postgres.fqgcxjddhddcrbazuseu` (프로젝트 참조 포함)

## 현재 프로젝트 설정

### 프로젝트 정보
- **프로젝트 참조**: `fqgcxjddhddcrbazuseu`
- **리전**: `ap-northeast-2` (서울)
- **데이터베이스**: `postgres`

### 권장 설정 (asyncpg 사용 시)

```bash
# .env 파일
DATABASE_URL=postgresql+asyncpg://postgres:wlq261820%211@db.fqgcxjddhddcrbazuseu.supabase.co:5432/postgres
```

이 설정은 asyncpg와 완전 호환되며 모든 PostgreSQL 기능을 사용할 수 있습니다.
