# GitHub Pages 설정 가이드

현재 `/docs` 폴더를 소스로 사용하고 있어서 마크다운 파일이 표시되고 있습니다. React 앱이 실행되도록 설정을 변경해야 합니다.

## 해결 방법

### 방법 1: GitHub Actions 사용 (권장)

1. **GitHub 저장소 → Settings → Pages**로 이동

2. **Source**를 다음 중 하나로 변경:
   - `Deploy from a branch` → `gh-pages` 브랜치 선택
   - 또는 **GitHub Actions** 선택 (더 권장)

3. **GitHub Actions를 선택한 경우:**
   - `.github/workflows/deploy.yml` 파일이 자동으로 실행됩니다
   - `main` 브랜치에 푸시하면 자동으로 배포됩니다

4. **환경 변수 설정 (Secrets):**
   - Settings → Secrets and variables → Actions
   - 다음 시크릿 추가:
     - `VITE_API_URL`: 백엔드 API URL (예: `https://your-backend.railway.app`)
     - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
     - `VITE_SUPABASE_ANON_KEY`: Supabase anon key

5. **첫 배포:**
   ```bash
   git add .
   git commit -m "Setup GitHub Actions deployment"
   git push origin main
   ```

6. **Actions 탭에서 배포 상태 확인:**
   - GitHub 저장소 → Actions 탭
   - 워크플로우가 성공적으로 완료되면 배포 완료

### 방법 2: gh-pages 브랜치 사용

로컬에서 빌드 후 `gh-pages` 브랜치에 배포:

```bash
cd frontend
npm install
npm run build

# gh-pages 브랜치 생성 및 배포
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force
```

그 후 GitHub Pages 설정에서 `gh-pages` 브랜치를 선택합니다.

## 현재 문제 해결

`docs` 폴더에 마크다운 파일들이 있어서 GitHub Pages가 마크다운을 우선 표시합니다.

### 임시 해결책 (빠른 수정)

`docs` 폴더에서 마크다운 파일들을 제거하고 빌드된 파일만 남기기:

```bash
# docs 폴더의 마크다운 파일들을 다른 곳으로 이동
mkdir -p docs-backup
mv docs/*.md docs-backup/

# 빌드된 파일만 남기기
# (index.html과 assets 폴더만 남아있어야 함)
```

하지만 **권장 방법은 GitHub Actions를 사용**하는 것입니다.

## 확인 사항

배포 후 다음을 확인하세요:

1. **URL 접속**: `https://meunji.github.io/household/`
2. **브라우저 콘솔 확인**: F12 → Console 탭에서 오류 확인
3. **네트워크 탭**: API 호출이 올바른 URL로 가는지 확인

## 문제 해결

### 여전히 마크다운이 표시되는 경우

1. GitHub Pages 설정이 `GitHub Actions`로 변경되었는지 확인
2. Actions 탭에서 배포가 성공했는지 확인
3. 브라우저 캐시 삭제 후 다시 접속

### 404 오류가 발생하는 경우

`vite.config.js`의 `base` 경로가 `/household/`로 설정되어 있는지 확인:

```javascript
export default defineConfig({
  base: '/household/',  // 저장소 이름에 맞게 설정
  // ...
})
```

### API 호출 오류

환경 변수 `VITE_API_URL`이 올바르게 설정되었는지 확인 (GitHub Secrets).
