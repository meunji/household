# Railway 배포 문제 해결

"Container failed to start" 오류 해결 방법입니다.

## 문제 상황

- ✅ 빌드 성공
- ❌ 컨테이너 시작 실패

## 가능한 원인

### 1. 환경 변수 누락 (가장 가능성 높음)

앱이 시작할 때 필수 환경 변수가 없어서 실패할 수 있습니다.

**확인 방법:**
1. Railway 대시보드 → 프로젝트 → 서비스
2. **Variables** 탭 확인
3. 다음 환경 변수가 모두 있는지 확인:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `ENVIRONMENT`
   - `ALLOWED_ORIGINS`

**해결 방법:**
모든 환경 변수를 추가하세요 (BACKEND_DEPLOYMENT.md 참조)

### 2. 포트 바인딩 문제

Railway는 `$PORT` 환경 변수를 제공하지만, 앱이 이를 제대로 읽지 못할 수 있습니다.

**확인 방법:**
Railway 로그에서 포트 관련 오류 확인

**해결 방법:**
`Procfile`이 올바른지 확인:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 3. 데이터베이스 연결 실패

앱 시작 시 데이터베이스 연결을 시도하다가 실패할 수 있습니다.

**확인 방법:**
Railway 로그에서 데이터베이스 연결 오류 확인

**해결 방법:**
- `DATABASE_URL`이 올바른지 확인
- Supabase Connection Pooler URL 사용 중인지 확인
- SSL 설정이 올바른지 확인

### 4. 앱 시작 시 오류

앱 코드 자체에 문제가 있을 수 있습니다.

**확인 방법:**
Railway 로그의 전체 오류 메시지 확인

## 해결 단계

### 1단계: 환경 변수 확인 및 설정

Railway 대시보드에서 다음 환경 변수를 모두 추가:

```
DATABASE_URL=postgresql+asyncpg://postgres.fqgcxjddhddcrbazuseu:wlq261820%211@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
SUPABASE_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
ENVIRONMENT=production
ALLOWED_ORIGINS=https://meunji.github.io
PORT=8000
```

**중요**: `PORT`는 Railway가 자동으로 설정하므로 추가하지 않아도 됩니다. 하지만 명시적으로 설정해도 됩니다.

### 2단계: 로그 확인

1. Railway 대시보드 → **Deployments** 탭
2. 실패한 배포 클릭
3. **Logs** 탭에서 전체 로그 확인
4. 오류 메시지 찾기

### 3단계: 로컬에서 테스트

로컬에서 환경 변수를 설정하고 테스트:

```bash
export DATABASE_URL="postgresql+asyncpg://postgres.fqgcxjddhddcrbazuseu:wlq261820%211@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
export SUPABASE_URL="https://fqgcxjddhddcrbazuseu.supabase.co"
export SUPABASE_KEY="sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr"
export ENVIRONMENT="production"
export ALLOWED_ORIGINS="https://meunji.github.io"
export PORT=8000

uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

로컬에서도 실패하면 코드 문제일 수 있습니다.

### 4단계: 간단한 시작 명령어 테스트

Railway에서 시작 명령어를 간단하게 변경해 테스트:

**Settings** → **Start Command**:
```
python -c "import sys; print(sys.version); import app.main; print('App imported successfully')"
```

이 명령어가 성공하면 앱 임포트는 정상입니다.

그 다음:
```
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

## 일반적인 오류 메시지

### "ModuleNotFoundError"

**원인**: 패키지가 설치되지 않음

**해결**: `requirements.txt` 확인 및 재배포

### "Connection refused" 또는 "Network is unreachable"

**원인**: 데이터베이스 연결 실패

**해결**: `DATABASE_URL` 확인 및 Supabase 연결 테스트

### "Port already in use"

**원인**: 포트 바인딩 문제

**해결**: `$PORT` 환경 변수 사용 확인

### "Missing environment variable"

**원인**: 필수 환경 변수 누락

**해결**: 모든 환경 변수 추가

## 다음 단계

1. Railway 로그의 **전체 오류 메시지**를 확인하세요
2. 환경 변수가 모두 설정되었는지 확인하세요
3. 로컬에서 동일한 환경 변수로 테스트하세요

로그의 정확한 오류 메시지를 알려주시면 더 구체적인 해결 방법을 제시할 수 있습니다.
