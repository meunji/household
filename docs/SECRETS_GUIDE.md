# GitHub Secrets 설정 가이드

GitHub Actions 배포에 필요한 시크릿 값을 확인하고 설정하는 방법입니다.

## 1. Supabase 프로젝트 URL 확인

### 방법 1: .env 파일에서 확인 (가장 빠름)

프로젝트 루트의 `.env` 파일을 확인하세요:
```
SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
```

또는 `frontend/.env.example` 파일:
```
VITE_SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
```

### 방법 2: Supabase 대시보드에서 확인

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Settings** (왼쪽 메뉴) → **API** 클릭
4. **Project URL** 섹션에서 확인
   - 형식: `https://[프로젝트-참조].supabase.co`

**현재 값:**
```
VITE_SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
```

---

## 2. Supabase Anon Key 확인

### 방법 1: .env 파일에서 확인

프로젝트 루트의 `.env` 파일:
```
SUPABASE_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
```

또는 `frontend/.env.example`:
```
VITE_SUPABASE_ANON_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
```

### 방법 2: Supabase 대시보드에서 확인

1. Supabase 대시보드 접속
2. **Settings** → **API** 클릭
3. **Project API keys** 섹션에서 확인
4. **anon** 또는 **public** 키 복사 (⚠️ `service_role` 키는 사용하지 마세요!)

**현재 값:**
```
VITE_SUPABASE_ANON_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
```

---

## 3. 백엔드 API URL 확인

### ⚠️ 백엔드 배포 전

백엔드를 아직 배포하지 않았다면, 일단 **로컬 개발용 URL을 설정**하거나 **비워둘 수 있습니다**.

워크플로우에서 기본값을 사용하도록 설정되어 있습니다:
```yaml
VITE_API_URL: ${{ secrets.VITE_API_URL || 'http://localhost:8000' }}
```

### 백엔드 배포 후 확인 방법

#### Railway 사용 시:
1. [Railway 대시보드](https://railway.app) 접속
2. 프로젝트 선택
3. 서비스 클릭
4. **Settings** → **Domains** 섹션에서 확인
   - 형식: `https://your-app-name.railway.app`
5. 또는 **Deployments** 탭에서 확인

#### Render 사용 시:
1. [Render 대시보드](https://render.com) 접속
2. 서비스 선택
3. 상단의 **URL** 확인
   - 형식: `https://your-app-name.onrender.com`

#### Heroku 사용 시:
1. [Heroku 대시보드](https://dashboard.heroku.com) 접속
2. 앱 선택
3. **Settings** → **Domains** 섹션에서 확인
   - 형식: `https://your-app-name.herokuapp.com`

### 백엔드 배포 후 테스트

배포된 백엔드 URL이 올바른지 확인:
```bash
# 헬스 체크
curl https://your-backend-url.com/health

# 응답 예시:
# {"status":"healthy"}
```

---

## GitHub Secrets 설정 방법

### 1. GitHub 저장소로 이동
`https://github.com/meunji/household`

### 2. Settings → Secrets and variables → Actions

### 3. "New repository secret" 클릭

### 4. 다음 3개 시크릿 추가:

#### Secret 1: VITE_SUPABASE_URL
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://fqgcxjddhddcrbazuseu.supabase.co`
- **Secret**: ✅ (기본값)

#### Secret 2: VITE_SUPABASE_ANON_KEY
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr`
- **Secret**: ✅ (기본값)

#### Secret 3: VITE_API_URL (백엔드 배포 후)
- **Name**: `VITE_API_URL`
- **Value**: 백엔드 배포 URL (예: `https://your-backend.railway.app`)
- **Secret**: ✅ (기본값)
- ⚠️ **백엔드 배포 전에는 설정하지 않아도 됩니다** (기본값 `http://localhost:8000` 사용)

---

## 현재 프로젝트 값 요약

```
VITE_SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
VITE_API_URL=(백엔드 배포 후 설정)
```

---

## 다음 단계

1. ✅ Supabase 값 2개는 지금 바로 설정 가능
2. ⏳ 백엔드 배포 후 `VITE_API_URL` 추가 설정
3. 변경사항 푸시 후 GitHub Actions 자동 배포 확인

## 문제 해결

### Supabase 값이 다른 경우
- `.env` 파일의 값이 최신인지 확인
- Supabase 대시보드에서 다시 확인

### 백엔드 URL을 모르는 경우
- 백엔드 배포 플랫폼(Railway, Render 등) 대시보드에서 확인
- 배포 로그에서 URL 확인
