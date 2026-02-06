# 가족 자산관리 및 가계부 앱 MVP

FastAPI 기반 가족 자산관리 및 가계부 앱의 백엔드 및 프론트엔드 MVP입니다.

## 기능

- 가족 단위 사용자 관리 (user_id 기준)
- 자산 내역 관리 (현금 보유액, 대출 잔액)
- 거래 내역 관리 (수입/지출, 카테고리 관리)
- 자산 계산 기능 (총 자산, 총 부채, 순자산, 월별 수입/지출)
- 웹 프론트엔드 (React + Vite)
- Google 소셜 로그인 (Supabase)

## 기술 스택

### 백엔드
- **Framework**: FastAPI
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLAlchemy (비동기)
- **인증**: Supabase JWT
- **마이그레이션**: Alembic

### 프론트엔드
- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router
- **인증**: Supabase Auth (Google OAuth)

## 빠른 시작

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

필수 환경 변수:
- `DATABASE_URL`: Supabase PostgreSQL 연결 문자열
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_KEY`: Supabase anon key

### 3. 데이터베이스 설정

**방법 1: SQL 스크립트 사용 (권장)**

Supabase 대시보드의 SQL Editor에서 `sql/init_schema.sql` 실행

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

## API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API 엔드포인트

### 인증
모든 API 엔드포인트는 `Authorization: Bearer <token>` 헤더가 필요합니다.

### 자산 관리
- `GET /api/assets` - 자산 목록 조회
- `POST /api/assets` - 자산 등록
- `GET /api/assets/{asset_id}` - 자산 상세 조회
- `PUT /api/assets/{asset_id}` - 자산 수정
- `DELETE /api/assets/{asset_id}` - 자산 삭제

### 거래 관리
- `GET /api/transactions` - 거래 목록 조회
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

## 프로젝트 구조

```
household/
├── app/                    # 백엔드 애플리케이션
│   ├── main.py            # FastAPI 앱 진입점
│   ├── config.py          # 설정 관리
│   ├── database.py        # 데이터베이스 연결
│   ├── dependencies.py    # 의존성 주입
│   ├── models/            # SQLAlchemy 모델
│   ├── schemas/           # Pydantic 스키마
│   ├── routers/           # API 라우터
│   └── services/          # 비즈니스 로직
├── frontend/              # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── api/          # API 클라이언트
│   │   ├── auth/         # 인증 관련
│   │   └── components/  # React 컴포넌트
│   └── package.json
├── sql/                   # SQL 마이그레이션 스크립트
│   ├── init_schema.sql
│   ├── migration_add_categories.sql
│   └── ...
├── docs/                  # 문서
│   ├── README_MIGRATION.md
│   ├── TROUBLESHOOTING_DB.md
│   └── SUPABASE_DB_CONNECTION.md
├── alembic/               # Alembic 마이그레이션
└── requirements.txt
```

## 모바일 지원

✅ **안드로이드 모바일에서 완전히 실행 가능합니다!**

- 안드로이드 브라우저(Chrome, Samsung Internet 등)에서 실행 가능
- 반응형 디자인으로 모바일 화면에 최적화
- 터치 인터페이스 지원
- 홈 화면에 추가 가능 (PWA 기능)

## 배포

GitHub에 배포하고 모바일에서 실행하는 방법은 [배포 가이드](DEPLOYMENT.md)를 참조하세요.

주요 배포 옵션:
- **프론트엔드**: GitHub Pages, Vercel, Netlify
- **백엔드**: Railway, Render, Heroku

## 문서

- [배포 가이드](DEPLOYMENT.md) - GitHub 배포 및 모바일 실행 방법
- [데이터베이스 마이그레이션 가이드](docs/README_MIGRATION.md) - 데이터베이스 스키마 생성 및 마이그레이션 방법
- [데이터베이스 연결 문제 해결](docs/TROUBLESHOOTING_DB.md) - 네트워크 연결 오류 해결 방법
- [Supabase 연결 설정](docs/SUPABASE_DB_CONNECTION.md) - Supabase 데이터베이스 연결 설정 가이드
- [프론트엔드 Google OAuth 설정](frontend/GOOGLE_OAUTH_SETUP.md) - Google 소셜 로그인 설정 방법

## 개발 가이드

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

## 문제 해결

데이터베이스 연결 문제가 발생하면 [TROUBLESHOOTING_DB.md](docs/TROUBLESHOOTING_DB.md)를 참조하세요.

## 라이선스

MIT
