# Supabase github.io 도메인 차단 해결 방법

Supabase가 `github.io` 도메인을 Site URL로 사용하는 것을 차단하는 경우 해결 방법입니다.

## 문제 상황

```
Failed to update auth configuration: Site URL contains blocked keywords. Please use a different URL.
```

## 해결 방법

### 방법 1: Site URL 없이 Redirect URLs만 사용 (권장)

Supabase는 Site URL 없이도 Redirect URLs만으로 작동할 수 있습니다.

#### 1단계: Site URL은 기본값 유지

- Site URL은 Supabase가 제공하는 기본값(예: `http://localhost:3000`)을 그대로 두거나
- 또는 임시로 `http://localhost:3000` 설정

#### 2단계: Redirect URLs에 프로덕션 URL 추가

**Authentication** → **URL Configuration** → **Redirect URLs**:

1. "Add URL" 클릭
2. 다음 URL 추가:
   ```
   https://meunji.github.io/household/
   ```
3. 저장

#### 3단계: 코드 확인

코드에서 리디렉션 URL을 명시적으로 설정하도록 이미 수정되어 있습니다.

### 방법 2: 커스텀 도메인 사용 (선택사항)

나중에 커스텀 도메인을 사용한다면:

1. GitHub Pages에 커스텀 도메인 설정
2. Supabase Site URL에 커스텀 도메인 설정

하지만 지금은 방법 1로 충분합니다.

## 현재 설정 확인

### Supabase 대시보드에서 확인할 사항

1. **Authentication** → **URL Configuration**
2. **Site URL**: 기본값 또는 `http://localhost:3000` (변경하지 않아도 됨)
3. **Redirect URLs**: 다음이 포함되어 있는지 확인
   ```
   https://meunji.github.io/household/
   ```

### 코드에서 확인할 사항

`frontend/src/components/Login.jsx`에서 리디렉션 URL이 자동으로 설정되도록 되어 있습니다:

```javascript
const basename = window.location.pathname.startsWith('/household/') ? '/household' : ''
const redirectTo = `${window.location.origin}${basename}/`
```

이 코드는 현재 실행 중인 환경에 맞게 리디렉션 URL을 자동으로 설정합니다.

## 테스트

1. **Supabase 설정 확인**:
   - Redirect URLs에 `https://meunji.github.io/household/` 추가됨
   - Site URL은 기본값 유지

2. **Google Cloud Console 확인**:
   - 승인된 리디렉션 URI에 `https://meunji.github.io/household/` 추가됨

3. **앱 테스트**:
   - `https://meunji.github.io/household/` 접속
   - Google 로그인 클릭
   - 정상적으로 리디렉션되는지 확인

## 중요 사항

- ✅ **Site URL은 변경하지 않아도 됩니다**
- ✅ **Redirect URLs만 설정하면 작동합니다**
- ✅ **코드에서 리디렉션 URL을 자동으로 감지합니다**

## 문제 해결

### 여전히 localhost로 리디렉션되는 경우

1. 브라우저 캐시 삭제: `Ctrl+Shift+R`
2. 시크릿 모드로 테스트
3. Supabase Redirect URLs에 정확한 URL이 추가되었는지 확인
4. Google Cloud Console의 승인된 리디렉션 URI 확인

### "redirect_uri_mismatch" 오류

Google Cloud Console의 **승인된 리디렉션 URI**에 다음을 추가:
```
https://meunji.github.io/household/
```

## 참고

- Supabase는 Site URL이 없어도 Redirect URLs만으로 OAuth가 작동합니다
- 코드에서 리디렉션 URL을 명시적으로 설정하므로 Site URL에 의존하지 않습니다
- `github.io` 도메인은 보안상 Site URL로 사용이 제한될 수 있지만, Redirect URLs로는 사용 가능합니다
