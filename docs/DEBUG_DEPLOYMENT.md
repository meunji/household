# 배포 디버깅 체크리스트

화면에 아무것도 나오지 않을 때 확인할 사항들입니다.

## 즉시 확인 사항

### 1. 브라우저 개발자 도구 열기

**F12** 키를 눌러 개발자 도구를 열고:

#### Console 탭 확인
다음과 같은 오류가 있는지 확인:
- ❌ `Missing Supabase environment variables`
- ❌ `Failed to fetch`
- ❌ `404 Not Found`
- ❌ `Uncaught Error`

#### Network 탭 확인
- 페이지 로드 시 실패한 요청(빨간색) 확인
- 특히 `.js` 파일이 404인지 확인

### 2. GitHub Actions 확인

1. GitHub 저장소 → **Actions** 탭
2. 최근 워크플로우 클릭
3. **Build** 단계 확인:
   - ✅ 성공했는지 확인
   - 환경 변수 로그 확인 (새로 추가한 echo 명령어)
   - `dist` 폴더가 생성되었는지 확인

### 3. 환경 변수 확인

GitHub 저장소 → Settings → Secrets and variables → Actions

다음 시크릿이 모두 있는지 확인:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ⚠️ `VITE_API_URL` (선택사항, 없어도 됨)

### 4. URL 확인

올바른 URL로 접속했는지 확인:
- ✅ `https://meunji.github.io/household/` (끝에 `/` 포함)
- ❌ `https://meunji.github.io/household` (끝에 `/` 없음)

## 일반적인 문제

### 문제 1: "Missing Supabase environment variables" 오류

**증상**: 콘솔에 이 오류가 표시됨

**원인**: 환경 변수가 빌드 시 주입되지 않음

**해결**:
1. GitHub Secrets 확인
2. 워크플로우가 최신 버전인지 확인 (방금 업데이트한 버전)
3. 빌드 재실행

### 문제 2: 빈 화면 (흰 화면)

**증상**: 화면이 완전히 비어있음

**가능한 원인**:
1. JavaScript 파일이 로드되지 않음
2. React 앱이 초기화되지 않음
3. Supabase 초기화 실패

**해결**:
1. Network 탭에서 `.js` 파일이 404인지 확인
2. `index.html`이 올바르게 로드되는지 확인
3. 브라우저 캐시 삭제: `Ctrl+Shift+R`

### 문제 3: "로딩 중..."에서 멈춤

**증상**: 로딩 화면만 보이고 진행되지 않음

**원인**: Supabase 인증 상태 확인 실패

**해결**:
1. 콘솔에서 네트워크 오류 확인
2. `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY` 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인

### 문제 4: 404 오류

**증상**: 페이지가 404 오류 표시

**원인**: 경로 문제

**해결**:
- URL 끝에 `/` 추가: `https://meunji.github.io/household/`
- `vite.config.js`의 `base: '/household/'` 확인

## 빠른 해결 방법

### 방법 1: 강제 새로고침

브라우저 캐시 문제일 수 있음:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- 또는 시크릿 모드로 접속

### 방법 2: 배포 재시도

1. GitHub Actions에서 워크플로우 재실행:
   - Actions 탭 → 최근 워크플로우 → "Re-run jobs"

2. 또는 빈 커밋으로 재배포:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

### 방법 3: 로컬 빌드 테스트

배포 전에 로컬에서 테스트:

```bash
cd frontend

# 환경 변수 설정
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

## 다음 단계

위의 확인 사항들을 체크한 후:

1. **브라우저 콘솔 오류 메시지**를 복사해주세요
2. **GitHub Actions 빌드 로그**를 확인해주세요
3. **Network 탭**에서 실패한 요청을 확인해주세요

이 정보를 알려주시면 더 정확한 해결 방법을 제시할 수 있습니다.
