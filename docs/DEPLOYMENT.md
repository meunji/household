# 배포 가이드

이 가이드는 프로젝트를 GitHub에 배포하고 안드로이드 모바일에서 실행하는 방법을 안내합니다.

## 모바일 지원

✅ **안드로이드 모바일에서 완전히 실행 가능합니다!**

현재 웹 앱이므로:
- 안드로이드 브라우저(Chrome, Samsung Internet 등)에서 실행 가능
- 반응형 디자인으로 모바일 화면에 최적화
- 터치 인터페이스 지원
- 홈 화면에 추가 가능 (PWA 기능)

## 배포 옵션

### 옵션 1: GitHub Pages (프론트엔드만, 정적 호스팅)

**장점**: 무료, 간단, 빠름  
**단점**: 백엔드 API는 별도 배포 필요

#### 1. GitHub 저장소 생성 및 푸시

```bash
# Git 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 저장소 생성 후
git remote add origin https://github.com/your-username/household.git
git branch -M main
git push -u origin main
```

#### 2. GitHub Pages 설정

1. GitHub 저장소 → **Settings** → **Pages**
2. Source: **GitHub Actions** 선택
3. 아래 워크플로우 파일 생성

#### 3. GitHub Actions 워크플로우 생성

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Build
        working-directory: ./frontend
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './frontend/dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 4. 환경 변수 설정 (GitHub Secrets)

GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

다음 시크릿 추가:
- `VITE_API_URL`: 백엔드 API URL (예: `https://your-backend.railway.app`)
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key

#### 5. Vite 설정 업데이트

`frontend/vite.config.js`에 base 경로 추가:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/household/',  // 저장소 이름에 맞게 수정
  // ... 나머지 설정
})
```

### 옵션 2: Vercel (프론트엔드, 추천)

**장점**: 무료, 자동 배포, 빠름, 모바일 최적화

#### 1. Vercel 배포

```bash
cd frontend
npm install -g vercel
vercel
```

또는 GitHub 연동:
1. [Vercel](https://vercel.com) 가입
2. GitHub 저장소 연결
3. 프로젝트 설정:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: `.env` 파일의 변수들 추가

### 옵션 3: Netlify (프론트엔드)

**장점**: 무료, 간단, GitHub 연동

1. [Netlify](https://netlify.com) 가입
2. GitHub 저장소 연결
3. 빌드 설정:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

## 백엔드 배포

### 옵션 1: Railway (추천)

**장점**: 무료 티어, 간단, PostgreSQL 지원

1. [Railway](https://railway.app) 가입
2. New Project → Deploy from GitHub
3. 환경 변수 설정:
   - `DATABASE_URL`: Supabase 연결 문자열
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_KEY`: Supabase anon key
   - `ENVIRONMENT`: `production`
   - `ALLOWED_ORIGINS`: 프론트엔드 URL (예: `https://your-app.vercel.app`)

### 옵션 2: Render

1. [Render](https://render.com) 가입
2. New Web Service → GitHub 저장소 연결
3. 설정:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. 환경 변수 설정:
   - `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`, `ENVIRONMENT`, `ALLOWED_ORIGINS`

### 옵션 3: Heroku

1. [Heroku](https://heroku.com) 가입
2. Heroku CLI 설치 후:
```bash
heroku create your-app-name
heroku config:set DATABASE_URL=your-database-url
heroku config:set SUPABASE_URL=your-supabase-url
heroku config:set SUPABASE_KEY=your-supabase-key
heroku config:set ENVIRONMENT=production
heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
git push heroku main
```

## 모바일에서 접근하기

### 방법 1: 브라우저에서 접속

1. 안드로이드 기기에서 브라우저 열기
2. 배포된 URL 입력 (예: `https://your-username.github.io/household`)
3. Google 로그인으로 접속

### 방법 2: 홈 화면에 추가 (PWA)

1. 브라우저에서 사이트 접속
2. 메뉴(⋮) → **홈 화면에 추가** 또는 **앱 설치**
3. 홈 화면에서 앱처럼 실행 가능

### 방법 3: PWA 매니페스트 추가 (선택사항)

더 나은 모바일 경험을 위해 PWA 매니페스트를 추가할 수 있습니다.

`frontend/public/manifest.json` 생성:

```json
{
  "name": "아은이네 부자되기",
  "short_name": "부자되기",
  "description": "가족 자산관리 및 가계부",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF8F0",
  "theme_color": "#FF8A80",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

`frontend/index.html`에 추가:

```html
<link rel="manifest" href="/manifest.json" />
```

## 모바일 최적화 확인

현재 구현된 모바일 최적화:

✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)  
✅ 터치 친화적 버튼 크기 (최소 44px)  
✅ 모바일 뷰포트 설정  
✅ 부드러운 스크롤  
✅ 카드 기반 레이아웃 (모바일에 적합)

## 배포 체크리스트

### 프론트엔드
- [ ] GitHub 저장소 생성 및 푸시
- [ ] 환경 변수 설정 (GitHub Secrets 또는 배포 플랫폼 설정)
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 배포 플랫폼 선택 및 설정
- [ ] CORS 설정 확인 (백엔드)

### 백엔드
- [ ] 배포 플랫폼 선택 (Railway, Render 등)
- [ ] 환경 변수 설정 (DATABASE_URL, SUPABASE_URL, SUPABASE_KEY, ENVIRONMENT)
- [ ] CORS 환경 변수 설정 (ALLOWED_ORIGINS에 프론트엔드 URL 추가)
- [ ] 데이터베이스 연결 확인
- [ ] 헬스 체크 엔드포인트 테스트 (`/health`)

### 모바일 테스트
- [ ] 안드로이드 브라우저에서 접속 테스트
- [ ] 반응형 레이아웃 확인
- [ ] 터치 인터페이스 테스트
- [ ] Google 로그인 테스트
- [ ] API 호출 테스트

## 문제 해결

### CORS 오류
백엔드 환경 변수에 프론트엔드 URL 추가:

`.env` 파일 또는 배포 플랫폼 환경 변수에 추가:
```bash
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://another-domain.com
```

여러 URL은 쉼표로 구분합니다. 백엔드가 자동으로 이 URL들을 허용합니다.

### 환경 변수 오류
배포 플랫폼에서 환경 변수가 올바르게 설정되었는지 확인

### 빌드 오류
로컬에서 빌드 테스트:
```bash
cd frontend
npm run build
```

## 참고

- 프론트엔드와 백엔드를 별도로 배포해야 합니다
- 환경 변수는 각 배포 플랫폼에서 설정해야 합니다
- Supabase는 이미 클라우드에 있으므로 추가 배포 불필요
