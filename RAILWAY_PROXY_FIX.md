# Railway 404 오류 - 프록시 설정 문제

모든 경로가 404를 반환하는 경우 Railway의 포트 프록시 설정 문제일 수 있습니다.

## 문제 원인

Railway가 도메인을 앱의 포트로 제대로 프록시하지 못하고 있습니다.

## 해결 방법

### 방법 1: Railway Settings에서 포트 재설정

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Networking** 또는 **Public Networking** 섹션 찾기
4. **Port** 필드 확인:
   - 현재: `8080` (로그에서 확인된 포트)
   - 또는 **Auto-detect** 선택
5. 저장 후 재배포

### 방법 2: Public Networking 재설정

1. **Settings** → **Networking**
2. **Public Networking** 토글:
   - OFF로 변경 → 저장
   - 잠시 대기 (10초)
   - 다시 ON으로 변경 → 저장
3. 재배포

### 방법 3: 도메인 재생성

1. **Settings** → **Networking** → **Domains**
2. 기존 도메인 삭제
3. **Generate Domain** 다시 클릭
4. 포트: `8080` (또는 Auto-detect)

### 방법 4: Railway 로그에서 실제 포트 확인

Railway 로그에서:
```
Uvicorn running on http://0.0.0.0:XXXX
```

이 포트 번호를 확인하고, Railway Settings의 포트 설정과 일치하는지 확인하세요.

## 확인 사항

### Railway Settings 확인

1. **Settings** → **Networking**
2. **Port**: 로그의 포트와 일치하는지 확인
3. **Public Networking**: ON인지 확인

### Railway 로그 확인

로그에서 다음을 확인:
- 실제 리스닝 포트: `Uvicorn running on http://0.0.0.0:XXXX`
- 이 포트가 Railway Settings의 포트와 일치하는지

## 빠른 해결

1. **Settings** → **Networking** → **Port**: `8080` (로그에서 확인된 포트)
2. **Public Networking**: ON
3. 저장
4. 재배포

## 대안: Render 사용

Railway가 계속 문제가 있다면 Render로 전환:

1. [Render](https://render.com) 접속
2. **New** → **Web Service**
3. GitHub 저장소 연결
4. 설정:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 환경 변수 추가
6. 배포

## 다음 단계

1. Railway Settings에서 포트를 `8080`으로 명시적으로 설정
2. Public Networking 재설정
3. 재배포
4. 테스트

결과를 알려주세요!
