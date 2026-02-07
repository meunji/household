# Railway Start Command 비활성화 시 해결 방법

Start Command 필드가 비활성화되어 있을 때 해결 방법입니다.

## 해결 방법: 환경 변수 PORT 설정

Railway가 Dockerfile을 사용하고 있으므로, 환경 변수로 PORT를 설정합니다.

### 1단계: Railway Variables에 PORT 추가

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Variables** 탭
3. **New Variable** 클릭
4. Name: `PORT`
5. Value: `8000`
6. **Add** 클릭

### 2단계: 재배포

1. **Deployments** 탭
2. **Redeploy** 클릭
3. 로그 확인

## 확인

배포 후 Railway 로그에서 확인:
- ✅ `Uvicorn running on http://0.0.0.0:8000`
- ✅ `Application startup complete`
- ❌ `$PORT` (문자열 그대로면 실패)

## 작동 원리

1. Railway가 `PORT` 환경 변수를 자동으로 설정하거나
2. Variables에서 설정한 `PORT=8000`을 사용
3. Dockerfile의 CMD에서 `${PORT:-8000}`가 PORT 값을 사용
4. PORT가 없으면 기본값 8000 사용

## 추가 확인 사항

Railway Settings에서:
- **Start Command**: 비활성화됨 (정상, Dockerfile 사용)
- **Port**: `8000` (Networking 섹션에서 확인)

## 문제가 계속되면

Railway가 PORT 환경 변수를 자동으로 설정하지 않는 경우:
1. Variables에 `PORT=8000` 명시적으로 추가
2. 재배포
3. 로그 확인

이 방법으로 해결됩니다!
