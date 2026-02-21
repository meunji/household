# 최종 설정 가이드

백엔드 도메인이 생성되었습니다: `household-production-1998.up.railway.app`

## 1단계: 백엔드 테스트

브라우저에서 다음 URL로 테스트:

1. **헬스 체크**: 
   ```
   https://household-production-1998.up.railway.app/health
   ```
   - 응답: `{"status":"healthy"}` ✅

2. **API 문서**: 
   ```
   https://household-production-1998.up.railway.app/docs
   ```
   - Swagger UI가 표시되는지 확인 ✅

## 2단계: GitHub Secrets에 백엔드 URL 추가

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `VITE_API_URL`
4. Value: `https://household-production-1998.up.railway.app`
   - **주의**: `https://` 포함
   - **주의**: 끝에 `/` 없이 입력
5. **Add secret** 클릭

## 3단계: 프론트엔드 재배포

GitHub Actions가 자동으로 재배포하거나, 수동으로 트리거:

```bash
git commit --allow-empty -m "Trigger frontend rebuild with backend URL"
git push origin main
```

또는 GitHub에서:
1. **Actions** 탭
2. 최근 워크플로우 → **Re-run jobs**

## 4단계: 최종 테스트

1. 프론트엔드 재배포 완료 대기 (2-3분)
2. `https://meunji.github.io/household/` 접속
3. Google 로그인
4. 브라우저 개발자 도구 (F12) → **Network** 탭
5. API 요청 확인:
   - ✅ `https://household-production-1998.up.railway.app/api/...` (프로덕션 URL)
   - ❌ `http://localhost:8000/api/...` (로컬 URL이면 실패)

## 문제 해결

### 백엔드가 응답하지 않는 경우

1. Railway 로그 확인:
   - 앱이 정상적으로 실행 중인지 확인
   - 환경 변수가 모두 설정되었는지 확인

2. 헬스 체크 테스트:
   ```
   https://household-production-1998.up.railway.app/health
   ```

### 프론트엔드가 여전히 localhost를 사용하는 경우

1. GitHub Secrets 확인:
   - `VITE_API_URL`이 올바르게 설정되었는지 확인
   - Value: `https://household-production-1998.up.railway.app`

2. GitHub Actions 빌드 로그 확인:
   - 환경 변수가 올바르게 주입되었는지 확인

3. 브라우저 캐시 삭제: `Ctrl+Shift+R`

### CORS 오류

백엔드의 `ALLOWED_ORIGINS` 환경 변수 확인:
```
ALLOWED_ORIGINS=https://meunji.github.io
```

Railway Variables에서 확인하세요.

## 성공 확인

다음이 모두 정상이면 성공입니다:

- ✅ 백엔드 헬스 체크 성공
- ✅ 백엔드 API 문서 접근 가능
- ✅ GitHub Secrets에 백엔드 URL 추가됨
- ✅ 프론트엔드 재배포 완료
- ✅ 프론트엔드에서 프로덕션 백엔드 URL로 API 호출
- ✅ 로그인 후 데이터 로드 성공

## 축하합니다! 🎉

이제 전체 앱이 프로덕션 환경에서 작동합니다!
