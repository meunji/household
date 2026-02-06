# 프로덕션 OAuth 설정 가이드

GitHub Pages에 배포된 앱에서 Google OAuth가 작동하도록 설정하는 방법입니다.

## 문제 상황

Google 로그인 후 `http://localhost:3000`으로 리디렉션되는 문제가 발생합니다.

## 해결 방법

### 1. Supabase 대시보드 설정

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Authentication** → **URL Configuration** 메뉴로 이동
4. **Redirect URLs** 섹션에서 다음 URL 추가:
   ```
   https://meunji.github.io/household/**
   ```
5. **Save** 클릭

### 2. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**로 이동
4. OAuth 클라이언트 ID 클릭
5. **승인된 리디렉션 URI** 섹션에서 다음 URI 추가:
   ```
   https://meunji.github.io/household/
   ```
6. **저장** 클릭

### 3. 코드 수정 (이미 완료됨)

`frontend/src/components/Login.jsx`에서 리디렉션 URL이 자동으로 현재 환경에 맞게 설정되도록 수정했습니다.

## 확인 사항

### Supabase 설정 확인

**Authentication** → **URL Configuration**에서:
- ✅ Site URL: `https://meunji.github.io/household/`
- ✅ Redirect URLs에 `https://meunji.github.io/household/**` 포함

### Google Cloud Console 확인

**승인된 리디렉션 URI**에 다음이 모두 포함되어 있는지 확인:
- ✅ `https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback` (Supabase 콜백)
- ✅ `https://meunji.github.io/household/` (프로덕션 앱)
- ✅ `http://localhost:3000` (로컬 개발용, 선택사항)

## 테스트

설정 완료 후:

1. 브라우저 캐시 삭제: `Ctrl+Shift+R`
2. `https://meunji.github.io/household/` 접속
3. "Google로 로그인" 버튼 클릭
4. Google 계정 선택
5. **프로덕션 URL로 리디렉션되는지 확인**

## 문제 해결

### 여전히 localhost로 리디렉션되는 경우

1. **브라우저 캐시 삭제**: `Ctrl+Shift+R`
2. **시크릿 모드로 테스트**: 캐시 없이 테스트
3. **Supabase 설정 확인**: Redirect URLs에 프로덕션 URL이 포함되어 있는지 확인
4. **Google Cloud Console 확인**: 승인된 리디렉션 URI 확인

### "redirect_uri_mismatch" 오류

Google Cloud Console의 **승인된 리디렉션 URI**에 다음을 추가:
```
https://meunji.github.io/household/
```

### "Invalid redirect URL" 오류

Supabase 대시보드의 **Redirect URLs**에 다음을 추가:
```
https://meunji.github.io/household/**
```

**참고**: `**`는 와일드카드로, 모든 하위 경로를 포함합니다.

## 참고

- Supabase는 자동으로 `https://[project].supabase.co/auth/v1/callback`을 사용합니다
- Google Cloud Console에는 Supabase 콜백 URL과 앱 리디렉션 URL 모두 필요합니다
- 설정 변경 후 즉시 반영되지만, 브라우저 캐시 때문에 이전 설정이 보일 수 있습니다
