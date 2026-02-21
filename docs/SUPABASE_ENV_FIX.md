# Supabase 환경 변수 오류 해결

Google 로그인 시 Supabase URL에 연결할 수 없는 오류 해결 방법입니다.

## 문제 원인

GitHub Secrets에 `VITE_SUPABASE_URL`이 설정되지 않았거나, 빌드 시 주입되지 않았을 수 있습니다.

## 해결 방법

### 1단계: GitHub Secrets 확인

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. 다음 시크릿이 모두 있는지 확인:
   - ✅ `VITE_SUPABASE_URL`: `https://fqgcxjddhddcrbazuseu.supabase.co`
   - ✅ `VITE_SUPABASE_ANON_KEY`: `sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr`
   - ✅ `VITE_API_URL`: `https://household-mej.up.railway.app`

### 2단계: 시크릿 값 확인

각 시크릿의 값이 올바른지 확인:

**VITE_SUPABASE_URL**:
```
https://fqgcxjddhddcrbazuseu.supabase.co
```
- `https://` 포함
- 끝에 `/` 없음

**VITE_SUPABASE_ANON_KEY**:
```
sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
```

### 3단계: GitHub Actions 빌드 로그 확인

1. GitHub → **Actions** 탭
2. 최근 워크플로우 클릭
3. **Build** 단계 확인
4. 환경 변수 로그 확인:
   ```
   VITE_SUPABASE_URL is set: yes
   VITE_SUPABASE_ANON_KEY is set: yes
   ```

### 4단계: 프론트엔드 재배포

시크릿을 추가하거나 수정한 후:

```bash
git commit --allow-empty -m "Trigger rebuild with Supabase environment variables"
git push origin main
```

또는 GitHub Actions에서:
- **Actions** 탭 → 최근 워크플로우 → **Re-run jobs**

## 확인 방법

배포 후 브라우저 개발자 도구에서:

1. **Console** 탭:
   - `Missing Supabase environment variables` 오류가 있는지 확인
   - Supabase 클라이언트 초기화 오류 확인

2. **Network** 탭:
   - Google 로그인 클릭 시
   - `fqgcxjddhddcrbazuseu.supabase.co`로 요청이 가는지 확인
   - 요청이 실패하는지 확인

## 문제 해결

### 시크릿이 없는 경우

1. **New repository secret** 클릭
2. Name: `VITE_SUPABASE_URL`
3. Value: `https://fqgcxjddhddcrbazuseu.supabase.co`
4. **Add secret** 클릭

### 시크릿 값이 잘못된 경우

1. 기존 시크릿 클릭
2. **Update** 클릭
3. 올바른 값 입력
4. **Update secret** 클릭

### 빌드 로그에서 환경 변수가 "no"인 경우

워크플로우 파일의 환경 변수 이름이 올바른지 확인:
- `VITE_SUPABASE_URL` (대문자)
- `VITE_SUPABASE_ANON_KEY` (대문자)

## 다음 단계

1. GitHub Secrets 확인 및 설정
2. 프론트엔드 재배포
3. 브라우저에서 테스트

결과를 알려주세요!
