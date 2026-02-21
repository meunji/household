# Supabase Redirect URL 차단 우회 방법

Supabase가 `github.io` 도메인을 Redirect URLs에 추가하는 것을 차단하는 경우 해결 방법입니다.

## 문제 상황

- Redirect URLs에 `https://meunji.github.io/household/` 추가 시도
- "Please provide a valid URL" 오류 발생
- Supabase가 `github.io` 도메인을 차단하는 것으로 보임

## 해결 방법: 코드에서만 리디렉션 처리

Supabase의 Redirect URLs 설정 없이도 코드에서 리디렉션 URL을 명시적으로 지정하면 작동할 수 있습니다.

### 현재 코드 상태

`frontend/src/components/Login.jsx`에서 이미 리디렉션 URL을 동적으로 설정하고 있습니다:

```javascript
const basename = window.location.pathname.startsWith('/household/') ? '/household' : ''
const redirectTo = `${window.location.origin}${basename}/`

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: redirectTo,
  },
})
```

### Supabase 설정

1. **Site URL**: 기본값 유지 (변경하지 않음)
   - 예: `http://localhost:3000` 또는 기본값

2. **Redirect URLs**: 비워두거나 기본값만 유지
   - Supabase가 github.io를 차단하므로 여기에 추가하지 않아도 됩니다
   - 코드에서 `redirectTo` 옵션으로 명시적으로 지정하므로 작동합니다

### Google Cloud Console 설정

**중요**: Google Cloud Console에서는 반드시 리디렉션 URI를 추가해야 합니다.

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**
4. OAuth 클라이언트 ID 클릭
5. **승인된 리디렉션 URI**에 다음 추가:
   ```
   https://meunji.github.io/household/
   ```
6. **저장** 클릭

## 작동 원리

1. 사용자가 "Google로 로그인" 클릭
2. 코드에서 현재 URL(`https://meunji.github.io/household/`)을 `redirectTo`로 설정
3. Supabase가 Google OAuth로 리디렉션
4. Google 인증 완료 후 Supabase 콜백으로 이동
5. Supabase가 코드에서 지정한 `redirectTo` URL로 최종 리디렉션
6. 앱이 인증 토큰을 받아서 로그인 처리

## 테스트

1. **Supabase 설정 확인**:
   - Site URL: 기본값 유지
   - Redirect URLs: 비워두거나 기본값만

2. **Google Cloud Console 확인**:
   - 승인된 리디렉션 URI에 `https://meunji.github.io/household/` 포함

3. **앱 테스트**:
   - `https://meunji.github.io/household/` 접속
   - Google 로그인 클릭
   - 정상적으로 리디렉션되는지 확인

## 문제 해결

### 여전히 localhost로 리디렉션되는 경우

1. 브라우저 캐시 삭제: `Ctrl+Shift+R`
2. 시크릿 모드로 테스트
3. 코드가 최신 버전인지 확인 (GitHub Actions 배포 확인)

### "redirect_uri_mismatch" 오류

Google Cloud Console의 **승인된 리디렉션 URI**에 다음을 확인:
- ✅ `https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback` (Supabase 콜백)
- ✅ `https://meunji.github.io/household/` (프로덕션 앱)

### 코드 확인

`frontend/src/components/Login.jsx`의 `redirectTo` 설정이 올바른지 확인:

```javascript
const basename = window.location.pathname.startsWith('/household/') ? '/household' : ''
const redirectTo = `${window.location.origin}${basename}/`
```

이 코드는 현재 실행 중인 환경에 맞게 자동으로 리디렉션 URL을 설정합니다.

## 참고

- Supabase의 Redirect URLs 설정은 **보안을 위한 추가 검증**입니다
- 코드에서 `redirectTo` 옵션으로 명시적으로 지정하면 Supabase가 이를 사용합니다
- Google Cloud Console의 리디렉션 URI는 반드시 설정해야 합니다 (Google의 요구사항)
- `github.io` 도메인이 차단되는 것은 Supabase의 보안 정책일 수 있습니다

## 대안 (필요한 경우)

만약 위 방법으로도 작동하지 않는다면:

1. **커스텀 도메인 사용**: GitHub Pages에 커스텀 도메인 연결 후 Supabase 설정
2. **Supabase 지원팀 문의**: github.io 도메인 사용에 대한 정책 확인
3. **다른 호스팅 서비스 사용**: Vercel, Netlify 등 (이들도 무료 제공)
