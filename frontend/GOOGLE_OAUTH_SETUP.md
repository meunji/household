# Google OAuth 설정 가이드

Supabase에서 Google 소셜 로그인을 사용하기 위한 설정 방법입니다.

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 및 OAuth 클라이언트 ID 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. **API 및 서비스** > **사용자 인증 정보**로 이동
4. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션** 선택
6. 이름 입력 (예: "가족 자산관리 앱")
7. 승인된 리디렉션 URI 추가:
   ```
   https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback
   ```
8. **만들기** 클릭
9. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사

## 2. Supabase 대시보드 설정

### 2.1 Google OAuth 제공자 활성화

1. Supabase 대시보드 접속
2. 프로젝트 선택
3. **Authentication** > **Providers** 메뉴로 이동
4. **Google** 제공자 찾기
5. **Enable Google** 토글 활성화
6. Google Cloud Console에서 복사한 정보 입력:
   - **Client ID (for OAuth)**: Google 클라이언트 ID
   - **Client Secret (for OAuth)**: Google 클라이언트 보안 비밀
7. **Save** 클릭

### 2.2 리디렉션 URL 확인

Supabase는 자동으로 다음 URL을 사용합니다:
```
https://[your-project-ref].supabase.co/auth/v1/callback
```

이 URL이 Google Cloud Console의 승인된 리디렉션 URI에 포함되어 있어야 합니다.

## 3. 프론트엔드 설정

프론트엔드 코드는 이미 Google OAuth를 사용하도록 설정되어 있습니다.

### 3.1 환경 변수 확인

`.env` 파일에 Supabase 설정이 올바르게 되어 있는지 확인:

```
VITE_SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
```

### 3.2 리디렉션 URL 설정

`src/components/Login.jsx`에서 리디렉션 URL이 올바르게 설정되어 있는지 확인:

```javascript
redirectTo: `${window.location.origin}`
```

## 4. 테스트

1. 프론트엔드 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:3000` 접속
3. "Google로 로그인" 버튼 클릭
4. Google 계정 선택 및 로그인
5. 리디렉션 후 자동으로 로그인되어야 함

## 5. 문제 해결

### redirect_uri_mismatch 오류 (400 오류)

이 오류는 Google Cloud Console에 등록된 리디렉션 URI와 실제 요청하는 URI가 일치하지 않을 때 발생합니다.

**해결 방법:**

1. **Google Cloud Console 확인**
   - [Google Cloud Console](https://console.cloud.google.com/) 접속
   - **API 및 서비스** > **사용자 인증 정보**
   - OAuth 클라이언트 ID 클릭
   - **승인된 리디렉션 URI** 섹션 확인

2. **필수 리디렉션 URI 추가**
   다음 URI가 반드시 포함되어 있어야 합니다:
   ```
   https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback
   ```
   
   **중요:** 
   - 정확히 위 URL을 복사해서 추가해야 합니다
   - 슬래시(`/`) 하나라도 다르면 오류가 발생합니다
   - `http://`가 아닌 `https://`를 사용해야 합니다

3. **저장 후 재시도**
   - URI 추가 후 **저장** 클릭
   - 변경사항이 반영되는데 몇 분 정도 걸릴 수 있습니다
   - 브라우저 캐시를 지우고 다시 시도해보세요

4. **개발 환경용 추가 URI (선택사항)**
   로컬 개발 환경에서도 테스트하려면 다음도 추가할 수 있습니다:
   ```
   http://localhost:3000
   http://localhost:3000/auth/callback
   ```

### Google 로그인 버튼 클릭 시 오류 발생

- Google Cloud Console에서 리디렉션 URI가 올바르게 설정되었는지 확인
- Supabase 대시보드에서 Google 제공자가 활성화되어 있는지 확인
- 클라이언트 ID와 Secret이 올바르게 입력되었는지 확인
- **redirect_uri_mismatch 오류인 경우 위의 해결 방법 참고**

### 로그인 후 리디렉션되지 않음

- 브라우저 콘솔에서 오류 메시지 확인
- Supabase 대시보드의 Authentication > URL Configuration에서 Site URL 확인

### Android 앱에서 사용 시

Android 앱에서도 동일한 Google OAuth를 사용하려면:

1. Google Cloud Console에서 Android 앱 추가
2. 패키지 이름과 SHA-1 인증서 지문 등록
3. Supabase에서 Android 리디렉션 URL 설정
4. Android 앱에서 Supabase SDK의 `signInWithOAuth` 사용

## 참고 자료

- [Supabase Google OAuth 문서](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
