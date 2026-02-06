# Supabase Site URL 설정 문제 해결

Google OAuth 후 `localhost:3000`으로 리디렉션되는 문제 해결 방법입니다.

## 문제 상황

- Google 로그인 성공
- 하지만 `http://localhost:3000`으로 리디렉션됨
- 프로덕션 URL인 `https://meunji.github.io/household/`로 가야 함

## 원인

Supabase의 **Site URL**이 `http://localhost:3000`으로 설정되어 있어서, OAuth 후 리디렉션 시 이 URL을 사용합니다.

## 해결 방법

### 방법 1: Supabase Site URL 변경 (권장)

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Authentication** → **URL Configuration** 메뉴
4. **Site URL** 필드 확인:
   - 현재: `http://localhost:3000` (또는 다른 localhost URL)
   - 변경: `https://meunji.github.io/household/`
5. **Save** 클릭

**주의**: `github.io` 도메인이 차단될 수 있습니다. 그 경우 방법 2를 사용하세요.

### 방법 2: 코드에서 자동 처리 (이미 구현됨)

코드에서 URL 해시의 토큰을 자동으로 감지하고 처리하도록 수정했습니다:

- `App.jsx`에서 OAuth 콜백 시 URL 해시의 `access_token` 감지
- 토큰이 있으면 세션 복원
- URL 해시 정리 (보안상)

이 방법은 Site URL이 localhost여도 작동합니다.

### 방법 3: 임시 해결 (수동)

만약 `localhost:3000`으로 리디렉션되면:

1. URL을 복사: `http://localhost:3000/#access_token=...`
2. `localhost:3000`을 `meunji.github.io/household`로 변경
3. 변경된 URL로 접속

하지만 이건 임시 방법이고, 위 방법들이 더 좋습니다.

## 확인 사항

### Supabase 설정 확인

1. **Authentication** → **URL Configuration**
2. **Site URL** 확인:
   - ✅ `https://meunji.github.io/household/` (프로덕션)
   - ❌ `http://localhost:3000` (개발용, 프로덕션에서는 문제)

### 코드 확인

`frontend/src/App.jsx`에서 OAuth 콜백 처리가 추가되었습니다:

```javascript
// URL 해시에서 토큰 감지
const hashParams = new URLSearchParams(window.location.hash.substring(1))
const accessToken = hashParams.get('access_token')

if (accessToken) {
  // 세션 복원
  await supabase.auth.setSession({...})
}
```

## 테스트

### 1. Supabase Site URL 변경 후

1. Site URL을 `https://meunji.github.io/household/`로 변경
2. 브라우저 캐시 삭제: `Ctrl+Shift+R`
3. `https://meunji.github.io/household/` 접속
4. Google 로그인 클릭
5. **프로덕션 URL로 리디렉션되는지 확인**

### 2. 코드 자동 처리 테스트

1. Site URL은 localhost로 유지 (변경하지 않음)
2. Google 로그인 클릭
3. `localhost:3000`으로 리디렉션되더라도
4. URL을 수동으로 프로덕션 URL로 변경
5. **자동으로 로그인되는지 확인** (코드가 토큰을 처리)

## 권장 방법

**방법 1 (Supabase Site URL 변경)**을 먼저 시도하고, `github.io`가 차단되면 **방법 2 (코드 자동 처리)**를 사용하세요.

방법 2는 이미 구현되어 있으므로, Site URL이 localhost여도 작동합니다. 다만 사용자가 수동으로 URL을 변경해야 할 수 있습니다.

## 완전 자동화 (선택사항)

더 나은 사용자 경험을 위해, `localhost:3000`으로 리디렉션되면 자동으로 프로덕션 URL로 리디렉션하는 코드를 추가할 수 있습니다:

```javascript
// localhost로 리디렉션된 경우 프로덕션 URL로 자동 리디렉션
if (window.location.hostname === 'localhost' && window.location.hash.includes('access_token')) {
  const hash = window.location.hash
  window.location.href = `https://meunji.github.io/household/${hash}`
}
```

이 코드는 필요시 추가할 수 있습니다.
