# 백엔드 배포 가이드

프론트엔드가 배포되었지만 백엔드 API 서버가 필요합니다. 백엔드를 배포하는 방법입니다.

## 현재 상황

- ✅ 프론트엔드: GitHub Pages에 배포됨 (`https://meunji.github.io/household/`)
- ❌ 백엔드: 아직 배포되지 않음 (로컬에서만 실행 중)
- 문제: 프론트엔드가 `http://localhost:8000`을 API URL로 사용하려고 함

## 해결 방법

### 옵션 1: Railway로 배포 (추천, 가장 간단)

#### 1단계: Railway 가입 및 프로젝트 생성

1. [Railway](https://railway.app) 접속 및 가입 (GitHub 계정으로 간편 가입)
2. **New Project** 클릭
3. **Deploy from GitHub repo** 선택
4. `household` 저장소 선택
5. **Add Service** → **Empty Service** 선택

#### 2단계: 환경 변수 설정

Railway 대시보드에서 **Variables** 탭으로 이동하여 다음 환경 변수 추가:

```
DATABASE_URL=postgresql+asyncpg://postgres.fqgcxjddhddcrbazuseu:wlq261820%211@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
SUPABASE_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
ENVIRONMENT=production
ALLOWED_ORIGINS=https://meunji.github.io
```

#### 3단계: 배포 설정

1. **Settings** 탭으로 이동
2. **Python Version**: `3.11` 선택 (또는 `3.12`, Railway가 지원하는 버전)
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Root Directory**: (비워둠, 루트 사용)

**참고**: `runtime.txt` 파일이 프로젝트 루트에 있으면 자동으로 Python 버전을 인식합니다.

#### 4단계: 도메인 확인

배포 완료 후:
1. **Settings** → **Domains** 섹션 확인
2. 생성된 URL 확인 (예: `https://your-app-name.railway.app`)
3. 이 URL을 복사

#### 5단계: GitHub Secrets에 백엔드 URL 추가

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `VITE_API_URL`
4. Value: Railway에서 생성된 URL (예: `https://your-app-name.railway.app`)
5. **Add secret** 클릭

#### 6단계: 재배포

GitHub Actions가 자동으로 재배포하거나, 수동으로 트리거:

```bash
git commit --allow-empty -m "Trigger rebuild with backend URL"
git push origin main
```

### 옵션 2: Render로 배포

1. [Render](https://render.com) 접속 및 가입
2. **New** → **Web Service**
3. GitHub 저장소 연결
4. 설정:
   - **Name**: `household-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 환경 변수 추가 (Railway와 동일)
6. 배포 완료 후 URL 확인
7. GitHub Secrets에 `VITE_API_URL` 추가

### 옵션 3: Heroku로 배포

1. [Heroku](https://heroku.com) 접속 및 가입
2. Heroku CLI 설치
3. 로컬에서 실행:

```bash
heroku login
heroku create your-app-name
heroku config:set DATABASE_URL=your-database-url
heroku config:set SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
heroku config:set SUPABASE_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
heroku config:set ENVIRONMENT=production
heroku config:set ALLOWED_ORIGINS=https://meunji.github.io
git push heroku main
```

## 환경 변수 확인

백엔드 배포 시 다음 환경 변수가 필요합니다:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | Supabase 데이터베이스 연결 문자열 |
| `SUPABASE_URL` | `https://fqgcxjddhddcrbazuseu.supabase.co` | Supabase 프로젝트 URL |
| `SUPABASE_KEY` | `sb_publishable_...` | Supabase anon key |
| `ENVIRONMENT` | `production` | 환경 설정 |
| `ALLOWED_ORIGINS` | `https://meunji.github.io` | CORS 허용 도메인 |

## GitHub Secrets 설정

백엔드 배포 후 GitHub Secrets에 추가:

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `VITE_API_URL`
4. Value: 배포된 백엔드 URL (예: `https://your-app.railway.app`)
5. 저장

## 테스트

백엔드 배포 및 GitHub Secrets 설정 완료 후:

1. GitHub Actions 재배포 (자동 또는 수동)
2. `https://meunji.github.io/household/` 접속
3. 로그인 후 API 호출 테스트
4. 브라우저 콘솔에서 API 요청 URL 확인:
   - ✅ `https://your-backend.railway.app/api/...`
   - ❌ `http://localhost:8000/api/...`

## 문제 해결

### 여전히 localhost로 요청하는 경우

1. GitHub Secrets에 `VITE_API_URL`이 올바르게 설정되었는지 확인
2. GitHub Actions 빌드 로그에서 환경 변수 확인
3. 브라우저 캐시 삭제: `Ctrl+Shift+R`

### CORS 오류

백엔드의 `ALLOWED_ORIGINS`에 프론트엔드 URL이 포함되어 있는지 확인:
```
ALLOWED_ORIGINS=https://meunji.github.io
```

### 백엔드 연결 실패

1. 백엔드 서버가 실행 중인지 확인
2. 백엔드 URL이 올바른지 확인
3. 백엔드 로그 확인 (Railway/Render 대시보드)

## 빠른 시작 (Railway)

가장 빠른 방법:

1. [Railway](https://railway.app) 가입
2. GitHub 저장소 연결
3. 환경 변수 설정 (위 참조)
4. **Python 버전 설정**: Settings → Python Version → `3.11` 또는 `3.12` 선택
5. 배포 완료 대기
6. 생성된 URL을 GitHub Secrets에 추가
7. 프론트엔드 재배포

약 5-10분이면 완료됩니다!

## Python 버전 문제 해결

### 문제: Python 3.13을 지원하지 않음

Railway는 아직 Python 3.13을 완전히 지원하지 않을 수 있습니다.

### 해결 방법

#### 방법 1: Railway 설정에서 Python 버전 지정

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Python Version** 드롭다운에서 `3.11` 또는 `3.12` 선택
4. 저장 후 재배포

#### 방법 2: runtime.txt 파일 사용 (권장)

프로젝트 루트에 `runtime.txt` 파일이 있으면 Railway가 자동으로 인식합니다:

```
python-3.11.9
```

또는

```
python-3.12.7
```

이 파일은 이미 프로젝트에 추가되어 있습니다.

#### 방법 3: railway.json 설정 파일 생성

프로젝트 루트에 `railway.json` 파일 생성:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 지원되는 Python 버전

Railway에서 일반적으로 지원하는 Python 버전:
- ✅ Python 3.11 (권장)
- ✅ Python 3.12
- ⚠️ Python 3.13 (일부 제한적 지원)

### 확인 방법

배포 로그에서 Python 버전 확인:
```
Python 3.11.x 또는 Python 3.12.x
```

이면 정상입니다.
