# 배포 완료 후 다음 단계

빌드가 성공했습니다! 이제 배포를 완료하고 프론트엔드와 연결해야 합니다.

## 1단계: Railway 배포 확인

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Deployments** 탭 확인
3. 최신 배포가 **성공** 상태인지 확인
4. **Logs** 탭에서 앱이 정상적으로 시작되었는지 확인:
   - `Application startup complete` 같은 메시지 확인
   - 포트 바인딩 확인

## 2단계: 백엔드 URL 확인

1. Railway 대시보드 → 프로젝트 → 서비스
2. **Settings** 탭 → **Domains** 섹션
3. 생성된 URL 확인 (예: `https://your-app-name.railway.app`)
4. 이 URL을 복사

## 3단계: 백엔드 테스트

브라우저에서 백엔드 URL로 접속하여 테스트:

1. **헬스 체크**: `https://your-app-name.railway.app/health`
   - 응답: `{"status":"healthy"}`

2. **API 문서**: `https://your-app-name.railway.app/docs`
   - Swagger UI가 표시되는지 확인

## 4단계: GitHub Secrets에 백엔드 URL 추가

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `VITE_API_URL`
4. Value: Railway에서 생성된 URL (예: `https://your-app-name.railway.app`)
   - **주의**: `http://`가 아닌 `https://`로 시작해야 합니다
   - 끝에 `/` 없이 입력 (예: `https://your-app-name.railway.app`)
5. **Add secret** 클릭

## 5단계: 프론트엔드 재배포

GitHub Actions가 자동으로 재배포하거나, 수동으로 트리거:

```bash
git commit --allow-empty -m "Trigger frontend rebuild with backend URL"
git push origin main
```

또는 GitHub Actions에서:
1. **Actions** 탭
2. 최근 워크플로우 → **Re-run jobs**

## 6단계: 최종 테스트

1. 프론트엔드 재배포 완료 대기 (2-3분)
2. `https://meunji.github.io/household/` 접속
3. Google 로그인
4. 브라우저 개발자 도구 (F12) → **Network** 탭
5. API 요청 확인:
   - ✅ `https://your-backend.railway.app/api/...` (프로덕션 URL)
   - ❌ `http://localhost:8000/api/...` (로컬 URL)

## 문제 해결

### 백엔드가 시작하지 않는 경우

Railway 로그 확인:
- 환경 변수가 모두 설정되었는지 확인
- 데이터베이스 연결 오류가 있는지 확인

### 프론트엔드가 여전히 localhost를 사용하는 경우

1. GitHub Secrets에 `VITE_API_URL`이 올바르게 설정되었는지 확인
2. GitHub Actions 빌드 로그에서 환경 변수 확인
3. 브라우저 캐시 삭제: `Ctrl+Shift+R`

### CORS 오류

백엔드의 `ALLOWED_ORIGINS` 환경 변수 확인:
```
ALLOWED_ORIGINS=https://meunji.github.io
```

## 성공 확인

다음이 모두 정상이면 성공입니다:

- ✅ Railway 배포 성공
- ✅ 백엔드 헬스 체크 성공 (`/health`)
- ✅ GitHub Secrets에 백엔드 URL 추가됨
- ✅ 프론트엔드 재배포 완료
- ✅ 프론트엔드에서 프로덕션 백엔드 URL로 API 호출
- ✅ 로그인 후 데이터 로드 성공

## 축하합니다! 🎉

이제 전체 앱이 프로덕션 환경에서 작동합니다!
