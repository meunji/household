# Railway Docker 빌드 오류 해결

"panic: send on closed channel" 오류는 Railway의 Docker 빌드 시스템 문제입니다.

## 문제 상황

- ✅ 빌드 성공 (패키지 설치 완료)
- ❌ Docker 이미지 로드 실패
- 오류: `panic: send on closed channel`

## 해결 방법

### 방법 1: Dockerfile 사용 (권장)

Railway가 Nixpacks 대신 Dockerfile을 사용하도록 설정:

1. **Dockerfile 추가됨**: 프로젝트 루트에 `Dockerfile`이 추가되었습니다
2. **Railway 설정**:
   - Settings → **Build Command**: (비워둠)
   - Settings → **Start Command**: (비워둠)
   - Dockerfile이 있으면 자동으로 사용됩니다

3. **재배포**:
   ```bash
   git add Dockerfile .dockerignore
   git commit -m "Add Dockerfile for Railway deployment"
   git push origin main
   ```

### 방법 2: 재배포 시도

일시적인 Railway 인프라 문제일 수 있습니다:

1. Railway 대시보드 → **Deployments**
2. **Redeploy** 클릭
3. 재시도

### 방법 3: Render로 전환 (대안)

Railway가 계속 실패하면 Render 사용:

1. [Render](https://render.com) 접속
2. **New** → **Web Service**
3. GitHub 저장소 연결
4. 설정:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 환경 변수 추가 (Railway와 동일)
6. 배포

## Dockerfile 사용의 장점

- ✅ 더 안정적인 빌드
- ✅ 빌드 과정 제어 가능
- ✅ Railway의 Nixpacks 오류 회피
- ✅ 재현 가능한 빌드

## 다음 단계

1. **Dockerfile 추가 확인**:
   ```bash
   git add Dockerfile .dockerignore
   git commit -m "Add Dockerfile for stable Railway deployment"
   git push origin main
   ```

2. **Railway 재배포**:
   - Railway가 자동으로 재배포하거나
   - 수동으로 Redeploy 클릭

3. **배포 로그 확인**:
   - Dockerfile을 사용하는지 확인
   - 빌드 성공 여부 확인

## 문제가 계속되면

1. **Render 사용** (더 안정적일 수 있음)
2. **Railway 지원팀 문의**: Railway 대시보드에서 지원 요청
3. **로컬 Docker 테스트**:
   ```bash
   docker build -t household-backend .
   docker run -p 8000:8000 --env-file .env household-backend
   ```

## 참고

- Dockerfile은 Python 3.11을 사용합니다
- `.dockerignore`로 불필요한 파일 제외
- 환경 변수는 Railway에서 설정해야 합니다
