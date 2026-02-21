# OAuth 설정 확인 체크리스트

설정이 완료되었으니 테스트해보세요!

## 설정 확인

### ✅ Supabase 설정
- [x] Redirect URLs에 `https://meunji.github.io/household/` 추가됨 (공백 없이)
- [x] Site URL은 기본값 유지

### ✅ Google Cloud Console 설정
- [x] 승인된 리디렉션 URI에 `https://meunji.github.io/household/` 추가됨
- [x] Supabase 콜백 URI도 포함: `https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback`

## 테스트 단계

### 1. 브라우저 캐시 삭제
- `Ctrl + Shift + R` (Windows/Linux)
- `Cmd + Shift + R` (Mac)
- 또는 시크릿 모드로 접속

### 2. 앱 접속
- URL: `https://meunji.github.io/household/`
- 메인 화면이 정상적으로 표시되는지 확인

### 3. Google 로그인 테스트
1. "Google로 로그인" 버튼 클릭
2. Google 계정 선택
3. 권한 승인
4. **프로덕션 URL로 리디렉션되는지 확인**
   - ✅ 성공: `https://meunji.github.io/household/`로 돌아옴
   - ❌ 실패: `http://localhost:3000`으로 리디렉션됨

### 4. 로그인 후 확인
- 로그인 성공 시 메인 화면으로 이동
- 네비게이션 바에 "자산 관리", "거래 관리", "요약" 메뉴 표시
- 사용자 정보가 올바르게 로드되는지 확인

## 문제 해결

### 여전히 localhost로 리디렉션되는 경우

1. **브라우저 캐시 완전 삭제**:
   - 개발자 도구 (F12) → Application 탭 → Clear storage → Clear site data

2. **코드 확인**:
   - GitHub Actions에서 최신 코드가 배포되었는지 확인
   - `frontend/src/components/Login.jsx`의 `redirectTo` 설정 확인

3. **시크릿 모드로 테스트**:
   - 캐시 없이 테스트

### "redirect_uri_mismatch" 오류

Google Cloud Console에서:
- ✅ `https://meunji.github.io/household/` 포함되어 있는지 확인
- ✅ URL 끝에 슬래시(`/`) 포함되어 있는지 확인
- ✅ 공백이 없는지 확인

### 로그인은 되지만 화면이 비어있는 경우

1. 브라우저 콘솔 확인 (F12 → Console)
2. 네트워크 탭에서 API 호출 확인
3. 백엔드 API URL이 올바른지 확인

## 성공 확인

다음이 모두 정상이면 성공입니다:

- ✅ Google 로그인 버튼 클릭 시 Google 인증 페이지로 이동
- ✅ 인증 완료 후 `https://meunji.github.io/household/`로 리디렉션
- ✅ 로그인 후 메인 화면 표시
- ✅ 네비게이션 메뉴 정상 작동
- ✅ API 호출 정상 (백엔드 배포 후)

## 다음 단계

OAuth가 정상 작동하면:

1. **백엔드 배포** (Railway, Render 등)
2. **환경 변수 설정**:
   - GitHub Secrets에 `VITE_API_URL` 추가 (백엔드 URL)
3. **전체 기능 테스트**
