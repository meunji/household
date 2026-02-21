# Google OAuth 디버깅 가이드

이메일/패스워드 폼이 표시되는 문제 해결 방법입니다.

## 문제 상황

- "Google로 로그인" 버튼 클릭 시 이메일/패스워드 입력 폼이 표시됨
- Google OAuth가 작동하지 않음

## 원인 확인

### 1. 브라우저 콘솔 확인

1. `https://meunji.github.io/household/` 접속
2. **F12** 키로 개발자 도구 열기
3. **Console** 탭 확인
4. "Google로 로그인" 버튼 클릭
5. 콘솔에 다음 로그가 나타나는지 확인:
   - `🔍 OAuth 시작:` - 리디렉션 URL 정보
   - `🔍 OAuth 응답:` - Supabase 응답
   - `✅ OAuth URL 생성됨` - 성공 시
   - 또는 오류 메시지

### 2. Supabase 설정 확인

#### Google 제공자 활성화 확인

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Authentication** → **Providers** 메뉴
4. **Google** 제공자 찾기
5. **Enable Google** 토글이 **ON**인지 확인
6. **Client ID**와 **Client Secret**이 입력되어 있는지 확인

#### Redirect URLs 확인

1. **Authentication** → **URL Configuration**
2. **Redirect URLs**에 다음이 포함되어 있는지 확인:
   ```
   https://meunji.github.io/household/
   ```

### 3. Google Cloud Console 확인

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**
4. OAuth 클라이언트 ID 클릭
5. **승인된 리디렉션 URI**에 다음이 포함되어 있는지 확인:
   ```
   https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback
   https://meunji.github.io/household/
   ```

## 해결 방법

### 방법 1: Supabase Google 제공자 재설정

1. Supabase 대시보드 → **Authentication** → **Providers**
2. **Google** 제공자 클릭
3. **Enable Google** 토글을 **OFF**로 변경 후 저장
4. 잠시 대기 (1-2분)
5. 다시 **ON**으로 변경
6. **Client ID**와 **Client Secret** 재입력
7. **Save** 클릭

### 방법 2: Google Cloud Console OAuth 재설정

1. Google Cloud Console → **API 및 서비스** → **사용자 인증 정보**
2. OAuth 클라이언트 ID 삭제 (또는 새로 생성)
3. 새 OAuth 클라이언트 ID 생성:
   - 애플리케이션 유형: **웹 애플리케이션**
   - 승인된 리디렉션 URI:
     ```
     https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback
     https://meunji.github.io/household/
     ```
4. 생성된 **Client ID**와 **Client Secret**을 Supabase에 입력

### 방법 3: 브라우저 캐시 완전 삭제

1. 개발자 도구 (F12) 열기
2. **Application** 탭 클릭
3. 왼쪽 메뉴에서 **Storage** 확장
4. **Clear site data** 클릭
5. 모든 항목 체크 후 **Clear site data** 클릭
6. 페이지 새로고침

## 디버깅 단계

### 1단계: 콘솔 로그 확인

브라우저 콘솔에서 다음을 확인:

- ✅ `🔍 OAuth 시작:` 로그가 나타나는가?
- ✅ `🔍 OAuth 응답:` 로그에 오류가 있는가?
- ❌ 오류 메시지가 있다면 무엇인가?

### 2단계: 네트워크 탭 확인

1. 개발자 도구 → **Network** 탭
2. "Google로 로그인" 클릭
3. `auth/v1/authorize` 요청 확인:
   - 상태 코드가 200인가?
   - 응답에 `url` 필드가 있는가?

### 3단계: 수동 테스트

브라우저 콘솔에서 직접 테스트:

```javascript
// 콘솔에 입력하여 테스트
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://meunji.github.io/household/',
  },
})
console.log('테스트 결과:', { data, error })
```

## 일반적인 오류

### "Provider is not enabled"

**원인**: Supabase에서 Google 제공자가 비활성화됨

**해결**: Supabase 대시보드에서 Google 제공자 활성화

### "redirect_uri_mismatch"

**원인**: Google Cloud Console의 리디렉션 URI 불일치

**해결**: Google Cloud Console에 올바른 URI 추가

### "Invalid client"

**원인**: Google Cloud Console의 Client ID/Secret이 잘못됨

**해결**: Supabase에 올바른 Client ID/Secret 입력

## 성공 확인

다음이 모두 정상이면 성공입니다:

- ✅ 브라우저 콘솔에 `✅ OAuth URL 생성됨` 로그
- ✅ Google 인증 페이지로 자동 리디렉션
- ✅ 인증 완료 후 프로덕션 URL로 리디렉션
- ✅ 로그인 성공

## 다음 단계

문제가 계속되면:

1. 브라우저 콘솔의 전체 오류 메시지 복사
2. Network 탭의 실패한 요청 확인
3. Supabase 대시보드 스크린샷 (Google 제공자 설정)
4. 위 정보를 바탕으로 추가 디버깅
