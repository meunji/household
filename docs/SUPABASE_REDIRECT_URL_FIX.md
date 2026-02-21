# Supabase Redirect URL 설정 가이드

"Please provide a valid URL" 오류가 발생할 때 해결 방법입니다.

## 문제 원인

Supabase의 Redirect URLs는 특정 형식을 요구합니다.

## 해결 방법

### 방법 1: 와일드카드 없이 정확한 URL 사용

Supabase 대시보드에서 **Redirect URLs**에 다음을 **하나씩** 추가:

```
https://meunji.github.io/household/
```

**주의사항:**
- ✅ 끝에 슬래시(`/`) 포함
- ✅ `https://` 프로토콜 포함
- ❌ 와일드카드(`**`) 사용하지 않음
- ❌ `http://` 사용하지 않음 (보안상 https만 허용)

### 방법 2: 여러 URL 추가 (필요한 경우)

만약 여러 경로가 필요하다면 각각 추가:

```
https://meunji.github.io/household/
https://meunji.github.io/household/summary
https://meunji.github.io/household/assets
https://meunji.github.io/household/transactions
```

하지만 일반적으로는 첫 번째 URL만 있으면 됩니다 (React Router가 클라이언트 사이드에서 처리).

### 방법 3: Site URL도 확인

**Authentication** → **URL Configuration**에서:

1. **Site URL**도 설정:
   ```
   https://meunji.github.io/household/
   ```

2. **Redirect URLs**에 추가:
   ```
   https://meunji.github.io/household/
   ```

## 단계별 설정

### 1단계: Site URL 설정

1. Supabase 대시보드 → **Authentication** → **URL Configuration**
2. **Site URL** 필드에 입력:
   ```
   https://meunji.github.io/household/
   ```
3. **Save** 클릭

### 2단계: Redirect URLs 추가

1. 같은 페이지의 **Redirect URLs** 섹션
2. **Add URL** 클릭
3. 다음 URL 입력 (정확히 복사):
   ```
   https://meunji.github.io/household/
   ```
4. **Add** 또는 **Save** 클릭

## 확인 사항

### ✅ 올바른 형식
- `https://meunji.github.io/household/` (끝에 `/` 포함)
- `https://` 프로토콜 사용
- 도메인과 경로가 정확함

### ❌ 잘못된 형식
- `http://meunji.github.io/household/` (http는 안됨)
- `https://meunji.github.io/household` (끝에 `/` 없음)
- `https://meunji.github.io/household/**` (와일드카드 사용)
- `meunji.github.io/household/` (프로토콜 없음)

## 문제 해결

### 여전히 "Please provide a valid URL" 오류가 나는 경우

1. **URL 복사 확인**: 브라우저 주소창에서 정확히 복사했는지 확인
2. **공백 제거**: 앞뒤 공백이 없는지 확인
3. **슬래시 확인**: 끝에 `/`가 있는지 확인
4. **프로토콜 확인**: `https://`로 시작하는지 확인

### 대안: Site URL만 설정

만약 Redirect URLs에 추가가 계속 실패한다면:

1. **Site URL**만 설정:
   ```
   https://meunji.github.io/household/
   ```

2. 코드에서 리디렉션 URL을 명시적으로 설정 (이미 코드에 반영됨)

## 테스트

설정 완료 후:

1. Supabase 대시보드에서 설정이 저장되었는지 확인
2. `https://meunji.github.io/household/` 접속
3. Google 로그인 테스트

## 참고

- Supabase는 Site URL과 Redirect URLs를 모두 확인합니다
- Site URL은 기본 리디렉션 대상으로 사용됩니다
- Redirect URLs는 추가로 허용할 리디렉션 대상입니다
- 일반적으로 Site URL만 설정해도 작동합니다
