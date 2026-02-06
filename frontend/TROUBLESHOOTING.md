# 배포 문제 해결 가이드

## 화면에 아무것도 나오지 않는 경우

### 1. 브라우저 개발자 도구 확인

**F12** 키를 눌러 개발자 도구를 열고 다음을 확인:

#### Console 탭
- 빨간색 오류 메시지 확인
- 특히 다음 오류가 있는지 확인:
  - `Failed to fetch`
  - `Missing Supabase environment variables`
  - `404 Not Found` (자산 파일)

#### Network 탭
- 페이지 로드 시 실패한 요청 확인
- JavaScript 파일(.js)이 404 오류인지 확인

### 2. GitHub Actions 로그 확인

1. GitHub 저장소 → **Actions** 탭
2. 최근 워크플로우 실행 클릭
3. **Build** 단계 확인:
   - ✅ 성공했는지 확인
   - ❌ 실패했다면 오류 메시지 확인

### 3. 환경 변수 확인

GitHub Secrets가 올바르게 설정되었는지 확인:

1. Settings → Secrets and variables → Actions
2. 다음 시크릿이 모두 있는지 확인:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (선택사항)

### 4. 일반적인 문제와 해결

#### 문제 1: "Missing Supabase environment variables" 오류

**원인**: 환경 변수가 빌드 시 주입되지 않음

**해결**:
1. GitHub Secrets 확인
2. 워크플로우 파일의 환경 변수 이름 확인
3. 빌드 재실행

#### 문제 2: JavaScript 파일 404 오류

**원인**: base 경로 설정 문제

**해결**:
- `vite.config.js`의 `base: '/household/'` 확인
- 저장소 이름이 다르면 경로 수정

#### 문제 3: 빈 화면 (흰 화면)

**원인**: 
- React 앱이 초기화되지 않음
- Supabase 초기화 실패
- JavaScript 오류

**해결**:
1. 브라우저 콘솔 확인
2. Network 탭에서 모든 파일이 로드되었는지 확인
3. 캐시 삭제 후 다시 시도: `Ctrl+Shift+R`

#### 문제 4: "로딩 중..."에서 멈춤

**원인**: Supabase 인증 상태 확인 실패

**해결**:
1. `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY` 확인
2. Supabase 프로젝트가 활성화되어 있는지 확인
3. 브라우저 콘솔에서 네트워크 오류 확인

### 5. 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드 테스트:

```bash
cd frontend

# 환경 변수 설정 (임시)
export VITE_SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
export VITE_SUPABASE_ANON_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
export VITE_API_URL=http://localhost:8000

# 빌드
npm run build

# 빌드 결과 확인
ls -la dist/

# 로컬 서버로 테스트
npx serve dist -s -l 3000
```

브라우저에서 `http://localhost:3000/household/` 접속하여 확인

### 6. GitHub Pages URL 확인

올바른 URL 형식:
- ✅ `https://meunji.github.io/household/`
- ❌ `https://meunji.github.io/household` (끝에 `/` 없음)
- ❌ `https://meunji.github.io/` (경로 없음)

### 7. 강제 새로고침

브라우저 캐시 문제일 수 있음:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- 또는 시크릿 모드로 접속

### 8. 배포 재시도

문제가 계속되면:

1. GitHub Actions에서 워크플로우 재실행:
   - Actions 탭 → 최근 워크플로우 → "Re-run jobs"

2. 또는 코드 푸시로 재배포:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

## 도움 요청 시 제공할 정보

문제를 해결하기 어려우면 다음 정보를 제공하세요:

1. 브라우저 콘솔 오류 메시지 (전체)
2. Network 탭에서 실패한 요청 목록
3. GitHub Actions 빌드 로그
4. 접속한 정확한 URL
5. 브라우저 종류 및 버전
