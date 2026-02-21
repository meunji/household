# 아은이네 부자되기 - 가족 자산관리 및 가계부 앱

FastAPI 기반 가족 자산관리 및 가계부 앱의 백엔드 및 프론트엔드 MVP입니다.

## 🎯 주요 기능

- **가족 그룹 관리**: 가족 단위로 계정 공유 및 구성원 관리
- **자산 내역 관리**: 현금 보유액, 대출 잔액 등록 및 관리
- **거래 내역 관리**: 수입/지출 등록, 카테고리별 관리
- **자산 계산 기능**: 총 자산, 총 부채, 순자산, 월별 수입/지출 자동 계산
- **가족 간 데이터 공유**: 가족 그룹 구성원 간 자산 및 거래 정보 공유
- **웹 프론트엔드**: React + Vite 기반 반응형 웹 앱
- **Google 소셜 로그인**: Supabase를 통한 간편한 Google OAuth 인증

## 🛠 기술 스택

### 백엔드
- **Framework**: FastAPI
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLAlchemy (비동기)
- **인증**: Supabase JWT
- **마이그레이션**: Alembic
- **Admin API**: Supabase Admin API (구성원 이메일 조회)

### 프론트엔드
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **인증**: Supabase Auth (Google OAuth)
- **상태 관리**: React Hooks (useState, useEffect)

### 배포
- **프론트엔드**: GitHub Pages
- **백엔드**: Railway
- **데이터베이스**: Supabase (PostgreSQL)

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경 변수 설정

`.env.example`을 참고하여 `.env` 파일을 생성하고 설정하세요:

```bash
cp .env.example .env
# .env 파일을 편집하여 실제 값 입력
```

**필수 환경 변수:**
- `DATABASE_URL`: Supabase PostgreSQL 연결 문자열
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_KEY`: Supabase anon key
- `SUPABASE_SERVICE_KEY`: Supabase service_role key (가족 구성원 추가 기능에 필요)

**선택 환경 변수:**
- `ALLOWED_ORIGINS`: CORS 허용 origin 목록 (쉼표로 구분)
- `ENVIRONMENT`: 환경 설정 (development/production)

### 3. 데이터베이스 설정

**방법 1: SQL 스크립트 사용 (권장)**

Supabase 대시보드의 SQL Editor에서 다음 순서로 실행:
1. `sql/init_schema.sql` - 기본 스키마 생성
2. `sql/create_family_tables.sql` - 가족 그룹 테이블 생성

**방법 2: Alembic 사용**

```bash
alembic upgrade head
```

자세한 내용은 [데이터베이스 마이그레이션 가이드](docs/README_MIGRATION.md)를 참조하세요.

### 4. 백엔드 서버 실행

```bash
uvicorn app.main:app --reload
```

서버는 기본적으로 `http://localhost:8000`에서 실행됩니다.

### 5. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 📚 API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔌 API 엔드포인트

### 인증
모든 API 엔드포인트는 `Authorization: Bearer <token>` 헤더가 필요합니다.

### 가족 그룹 관리
- `POST /api/family/groups` - 가족 그룹 생성
- `GET /api/family/groups/my` - 내가 속한 가족 그룹 조회
- `POST /api/family/groups/{family_group_id}/members` - 구성원 추가
- `DELETE /api/family/groups/{family_group_id}/members/{member_user_id}` - 구성원 제거

### 자산 관리
- `GET /api/assets` - 자산 목록 조회 (가족 그룹 구성원 포함)
- `POST /api/assets` - 자산 등록
- `GET /api/assets/{asset_id}` - 자산 상세 조회
- `PUT /api/assets/{asset_id}` - 자산 수정
- `DELETE /api/assets/{asset_id}` - 자산 삭제

### 거래 관리
- `GET /api/transactions` - 거래 목록 조회 (가족 그룹 구성원 포함)
- `POST /api/transactions` - 거래 등록
- `GET /api/transactions/{transaction_id}` - 거래 상세 조회
- `PUT /api/transactions/{transaction_id}` - 거래 수정
- `DELETE /api/transactions/{transaction_id}` - 거래 삭제

### 카테고리 관리
- `GET /api/categories?type={INCOME|EXPENSE}` - 거래 유형별 카테고리 목록 조회
- `GET /api/categories/all` - 모든 카테고리 조회

### 계산 기능
- `GET /api/calculations/summary` - 전체 요약 (총 자산, 총 부채, 순자산)
- `GET /api/calculations/monthly` - 이번 달 수입/지출 합계

## 📁 프로젝트 구조

```
household/
├── app/                    # 백엔드 애플리케이션
│   ├── main.py            # FastAPI 앱 진입점
│   ├── config.py          # 설정 관리
│   ├── database.py        # 데이터베이스 연결
│   ├── dependencies.py    # 의존성 주입
│   ├── models/            # SQLAlchemy 모델
│   │   ├── user.py
│   │   ├── asset.py
│   │   ├── transaction.py
│   │   ├── category.py
│   │   └── family.py      # 가족 그룹 모델
│   ├── schemas/           # Pydantic 스키마
│   │   ├── user.py
│   │   ├── asset.py
│   │   ├── transaction.py
│   │   ├── category.py
│   │   └── family.py      # 가족 그룹 스키마
│   ├── routers/           # API 라우터
│   │   ├── assets.py
│   │   ├── transactions.py
│   │   ├── calculations.py
│   │   ├── categories.py
│   │   └── family.py      # 가족 그룹 라우터
│   └── services/          # 비즈니스 로직
│       ├── asset_service.py
│       ├── transaction_service.py
│       ├── calculation_service.py
│       ├── category_service.py
│       └── family_service.py  # 가족 그룹 서비스
├── frontend/              # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── api/          # API 클라이언트
│   │   │   ├── client.js
│   │   │   ├── endpoints.js
│   │   │   └── services.js
│   │   ├── auth/         # 인증 관련
│   │   │   └── supabase.js
│   │   └── components/   # React 컴포넌트
│   │       ├── Login.jsx
│   │       ├── Summary.jsx
│   │       ├── AssetForm.jsx
│   │       ├── TransactionForm.jsx
│   │       └── FamilyAdmin.jsx  # 가족 관리 컴포넌트
│   ├── public/
│   │   └── img/
│   │       └── fam.jpg    # 가족 이미지
│   └── package.json
├── sql/                   # SQL 마이그레이션 스크립트
│   ├── init_schema.sql
│   ├── create_family_tables.sql
│   ├── migration_add_categories.sql
│   └── ...
├── docs/                  # 문서
│   ├── README_MIGRATION.md
│   ├── TROUBLESHOOTING_DB.md
│   └── SUPABASE_DB_CONNECTION.md
├── alembic/               # Alembic 마이그레이션
├── requirements.txt
└── README.md
```

## 👨‍👩‍👧‍👦 가족 그룹 기능

### 가족 그룹 생성
1. 관리자 화면에서 "가족 그룹 생성하기" 클릭
2. 가족 그룹 이름 입력 (예: "아은이네")
3. 생성 후 자동으로 관리자로 추가됨

### 구성원 추가
1. 관리자 화면에서 구성원 추가 섹션으로 이동
2. 추가할 사용자의 Google 계정 이메일 입력
3. "추가" 버튼 클릭
4. 해당 사용자가 가족 그룹에 추가됨

### 데이터 공유
- 가족 그룹에 속한 모든 구성원의 자산 및 거래 정보가 공유됩니다
- 각 구성원은 자신이 등록한 데이터를 수정/삭제할 수 있습니다
- 다른 구성원의 데이터는 조회만 가능합니다

## 📱 모바일 지원

✅ **안드로이드 모바일에서 완전히 실행 가능합니다!**

- 안드로이드 브라우저(Chrome, Samsung Internet 등)에서 실행 가능
- 반응형 디자인으로 모바일 화면에 최적화
- 터치 인터페이스 지원
- 홈 화면에 추가 가능 (PWA 기능)

## 🚢 배포

### 프론트엔드 배포 (GitHub Pages)

1. GitHub 저장소에 코드 푸시
2. GitHub Actions를 통한 자동 배포 설정 (`.github/workflows/deploy.yml`)
3. GitHub Pages 설정에서 Source를 "GitHub Actions"로 변경
4. 환경 변수 설정:
   - `VITE_API_URL`: 백엔드 API URL
   - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase anon key

### 백엔드 배포 (Railway)

1. Railway에 프로젝트 연결
2. Dockerfile 또는 Nixpacks를 사용한 빌드
3. 환경 변수 설정:
   - `DATABASE_URL`: Supabase PostgreSQL 연결 문자열
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_KEY`: Supabase anon key
   - `SUPABASE_SERVICE_KEY`: Supabase service_role key
   - `ALLOWED_ORIGINS`: 프론트엔드 URL (예: `https://meunji.github.io`)
   - `PORT`: 포트 번호 (Railway가 자동 설정)

자세한 배포 가이드는 [배포 가이드](DEPLOYMENT.md)를 참조하세요.

## 📖 문서

- [배포 가이드](DEPLOYMENT.md) - GitHub 배포 및 모바일 실행 방법
- [데이터베이스 마이그레이션 가이드](docs/README_MIGRATION.md) - 데이터베이스 스키마 생성 및 마이그레이션 방법
- [데이터베이스 연결 문제 해결](docs/TROUBLESHOOTING_DB.md) - 네트워크 연결 오류 해결 방법
- [Supabase 연결 설정](docs/SUPABASE_DB_CONNECTION.md) - Supabase 데이터베이스 연결 설정 가이드
- [프론트엔드 Google OAuth 설정](frontend/GOOGLE_OAUTH_SETUP.md) - Google 소셜 로그인 설정 방법

## 🛠 개발 가이드

### 마이그레이션 생성

모델 변경 후 마이그레이션 생성:

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### 데이터베이스 연결 테스트

```bash
python3 test_db_connection.py
```

### 프론트엔드 빌드

```bash
cd frontend
npm run build
```

빌드된 파일은 `frontend/dist/` 디렉토리에 생성됩니다.

## ⚠️ 문제 해결

### 데이터베이스 연결 문제
데이터베이스 연결 문제가 발생하면 [TROUBLESHOOTING_DB.md](docs/TROUBLESHOOTING_DB.md)를 참조하세요.

### CORS 오류
프로덕션 환경에서 CORS 오류가 발생하면:
1. 백엔드 환경 변수에 `ALLOWED_ORIGINS` 설정 확인
2. Supabase Redirect URLs에 프론트엔드 URL 추가

### 구성원 이메일 조회 실패
구성원 추가 후 이메일이 표시되지 않으면:
1. `SUPABASE_SERVICE_KEY` 환경 변수 확인
2. Supabase 대시보드에서 service_role key 확인
3. 백엔드 로그에서 오류 메시지 확인

## 📝 라이선스

MIT
