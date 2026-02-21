# Railway 최종 해결 방법

`$PORT` 환경 변수가 계속 확장되지 않는 문제의 최종 해결 방법입니다.

## 문제 원인

Railway가 Dockerfile의 CMD를 사용하지 않고 Settings의 Start Command를 우선 사용하고 있습니다.

## 해결 방법: Railway Settings에서 Start Command 설정

### 1단계: Railway Settings 확인 및 수정

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Start Command** 필드 찾기
4. 다음 명령어 입력:
   ```
   sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
   ```
5. **Save** 클릭

### 2단계: 재배포

1. **Deployments** 탭
2. **Redeploy** 클릭
3. 로그 확인

## 대안: 환경 변수 PORT 설정

만약 위 방법이 작동하지 않으면:

1. Railway → **Variables** 탭
2. **New Variable** 클릭
3. Name: `PORT`
4. Value: `8000`
5. 저장
6. 재배포

그러면 Dockerfile의 `${PORT:-8000}`에서 기본값 8000을 사용합니다.

## 확인

배포 후 Railway 로그에서 확인:
- ✅ `Uvicorn running on http://0.0.0.0:8000` (또는 다른 포트 번호)
- ✅ `Application startup complete`
- ❌ `$PORT` (문자열 그대로면 실패)

## 최종 확인 사항

Railway Settings에서:
- ✅ Start Command: `sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"`
- 또는
- ✅ Variables에 `PORT=8000` 환경 변수 설정

둘 중 하나만 설정하면 됩니다.
