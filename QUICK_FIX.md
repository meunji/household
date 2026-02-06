# 빠른 해결 방법

현재 GitHub Pages가 `/docs` 폴더를 소스로 사용하고 있어서 마크다운 파일이 표시되고 있습니다.

## 즉시 해결 (3단계)

### 1단계: GitHub Pages 설정 변경

1. GitHub 저장소로 이동: `https://github.com/meunji/household`
2. **Settings** → **Pages** 클릭
3. **Source** 섹션에서:
   - 현재: `Deploy from a branch` → `/docs` 폴더 선택됨
   - 변경: **GitHub Actions** 선택
4. 저장 (변경사항 자동 저장됨)

### 2단계: 환경 변수 설정 (Secrets)

1. 같은 페이지에서 **Settings** → **Secrets and variables** → **Actions** 클릭
2. **New repository secret** 클릭하여 다음 추가:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Supabase 프로젝트 URL (예: `https://fqgcxjddhddcrbazuseu.supabase.co`)

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Supabase anon key

   **Secret 3 (백엔드 배포 후):**
   - Name: `VITE_API_URL`
   - Value: 백엔드 API URL (예: `https://your-backend.railway.app`)

### 3단계: 변경사항 푸시

터미널에서 실행:

```bash
cd /home/meunji/work/cursor/household
git add .
git commit -m "Setup GitHub Actions for deployment"
git push origin main
```

### 4단계: 배포 확인

1. GitHub 저장소 → **Actions** 탭 클릭
2. "Deploy to GitHub Pages" 워크플로우가 실행되는지 확인
3. 약 2-3분 후 완료되면 `https://meunji.github.io/household/` 접속
4. React 앱이 정상적으로 표시되는지 확인

## 문제 해결

### 여전히 마크다운이 보이는 경우

1. 브라우저 캐시 삭제: `Ctrl+Shift+R` (Windows/Linux) 또는 `Cmd+Shift+R` (Mac)
2. GitHub Actions에서 배포가 성공했는지 확인
3. Pages 설정이 "GitHub Actions"로 변경되었는지 다시 확인

### 404 오류가 발생하는 경우

`vite.config.js`의 `base` 경로 확인:
- 현재: `base: '/household/'` ✅ (올바름)
- 저장소 이름이 다르면 경로 수정 필요

### API 호출 오류

환경 변수가 올바르게 설정되었는지 확인:
- Settings → Secrets and variables → Actions
- `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 모두 설정되어 있는지 확인

## 참고

- 첫 배포는 약 2-3분 소요됩니다
- 이후 `main` 브랜치에 푸시할 때마다 자동으로 재배포됩니다
- `docs` 폴더의 마크다운 파일들은 그대로 두어도 됩니다 (GitHub Actions가 사용하지 않음)
