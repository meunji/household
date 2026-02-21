# GitHub Secrets 확인 가이드

프론트엔드에서 Supabase URL을 찾지 못하는 문제 해결 방법입니다.

## 확인 사항

### 1. GitHub Secrets 확인

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **Repository secrets** 탭 확인
3. 다음 시크릿이 모두 있는지 확인:
   - ✅ `VITE_SUPABASE_URL`
   - ✅ `VITE_SUPABASE_ANON_KEY`
   - ✅ `VITE_API_URL`

### 2. 시크릿 값 확인

각 시크릿을 클릭하여 값 확인 (값은 표시되지 않지만, 편집 가능):

**VITE_SUPABASE_URL**:
- 올바른 값: `https://fqgcxjddhddcrbazuseu.supabase.co`
- `https://` 포함
- 끝에 `/` 없음

**VITE_SUPABASE_ANON_KEY**:
- 올바른 값: `sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr`

**VITE_API_URL**:
- 올바른 값: `https://household-mej.up.railway.app`
- `https://` 포함
- 끝에 `/` 없음

### 3. GitHub Actions 빌드 로그 확인

1. GitHub → **Actions** 탭
2. 최근 워크플로우 클릭
3. **Build** 단계 클릭
4. 로그에서 다음 확인:
   ```
   VITE_SUPABASE_URL is set: yes
   VITE_SUPABASE_ANON_KEY is set: yes
   ```

만약 "no"로 표시되면 시크릿이 설정되지 않은 것입니다.

## 해결 방법

### 시크릿이 없는 경우

1. **New repository secret** 클릭
2. Name: `VITE_SUPABASE_URL`
3. Value: `https://fqgcxjddhddcrbazuseu.supabase.co`
4. **Add secret** 클릭

같은 방법으로 나머지 시크릿도 추가:
- `VITE_SUPABASE_ANON_KEY`: `sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr`
- `VITE_API_URL`: `https://household-mej.up.railway.app`

### 시크릿 값이 잘못된 경우

1. 기존 시크릿 클릭
2. **Update** 클릭
3. 올바른 값 입력
4. **Update secret** 클릭

### 재배포

시크릿을 추가하거나 수정한 후:

```bash
git commit --allow-empty -m "Trigger rebuild with correct environment variables"
git push origin main
```

또는 GitHub Actions에서:
- **Actions** 탭 → 최근 워크플로우 → **Re-run jobs**

## 확인

배포 후 브라우저 개발자 도구에서:

1. **Console** 탭:
   - `Missing Supabase environment variables` 오류가 없는지 확인
   - Supabase 클라이언트가 정상 초기화되었는지 확인

2. **Network** 탭:
   - Google 로그인 클릭 시
   - `fqgcxjddhddcrbazuseu.supabase.co`로 요청이 가는지 확인

## 참고

- Supabase URL에 직접 접속하면 "requested path is invalid"가 나오는 것은 정상입니다
- Supabase는 API 서버이므로 특정 엔드포인트(`/auth/v1/` 등)만 있습니다
- 문제는 프론트엔드 빌드 시 환경 변수가 주입되지 않는 것입니다
