# Railway 포트 8000 설정

앱이 포트 8000에서 정상적으로 실행 중입니다. Railway Settings에서 포트를 8000으로 설정해야 합니다.

## 확인된 정보

- ✅ 앱 시작 완료: `Application startup complete`
- ✅ 포트: `8000` (`Uvicorn running on http://0.0.0.0:8000`)
- ❌ 502 오류: Railway Settings의 포트가 8000과 일치하지 않음

## 해결 방법

### Railway Settings에서 포트 설정

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Networking** 섹션 찾기
4. **Port** 필드:
   - 현재 값 확인
   - **`8000`**으로 변경
5. **Save** 클릭

### Public Networking 확인

1. **Settings** → **Networking**
2. **Public Networking**: **ON**인지 확인
3. **Port**: **`8000`**인지 확인

### 재배포 (필요시)

포트를 변경한 후:
1. **Deployments** 탭
2. **Redeploy** 클릭 (또는 자동 재배포 대기)

## 확인

포트 설정 후:

1. **헬스 체크**: `https://household-mej.up.railway.app/health`
   - 응답: `{"status":"healthy"}` ✅

2. **API 문서**: `https://household-mej.up.railway.app/docs`
   - Swagger UI 표시 ✅

3. **루트 경로**: `https://household-mej.up.railway.app/`
   - API 정보 표시 ✅

## 중요 사항

- 앱은 포트 **8000**에서 실행 중입니다
- Railway Settings의 포트도 **8000**이어야 합니다
- 포트가 일치하지 않으면 502 오류 발생

포트를 8000으로 설정한 후 테스트해보세요!
