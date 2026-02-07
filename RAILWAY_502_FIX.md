# Railway 502 Bad Gateway 오류 해결

502 오류는 백엔드 서버가 제대로 시작되지 않았을 때 발생합니다.

## 즉시 확인 사항

### 1. Railway 로그 확인

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Deployments** 탭 → 최신 배포 클릭
3. **Logs** 탭 확인

다음을 확인하세요:
- ✅ `Application startup complete` 메시지가 있는지
- ✅ `Uvicorn running on http://0.0.0.0:XXXX` 메시지가 있는지
- ❌ 오류 메시지가 있는지 (특히 환경 변수 관련)

### 2. 환경 변수 확인

Railway 대시보드 → **Variables** 탭에서 다음이 모두 있는지 확인:

```
DATABASE_URL=postgresql+asyncpg://postgres.fqgcxjddhddcrbazuseu:wlq261820%211@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
SUPABASE_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
ENVIRONMENT=production
ALLOWED_ORIGINS=https://meunji.github.io
```

## 일반적인 원인과 해결

### 원인 1: 환경 변수 누락

**증상**: 로그에 "Missing environment variable" 오류

**해결**:
1. Railway → Variables 탭
2. 모든 환경 변수 추가
3. 재배포

### 원인 2: 앱 시작 실패

**증상**: 로그에 Python 오류 또는 import 오류

**해결**:
1. 로그의 전체 오류 메시지 확인
2. 코드 문제인지 확인
3. 로컬에서 동일한 환경 변수로 테스트

### 원인 3: 데이터베이스 연결 실패

**증상**: 로그에 데이터베이스 연결 오류

**해결**:
1. `DATABASE_URL`이 올바른지 확인
2. Supabase Connection Pooler가 활성화되어 있는지 확인
3. SSL 설정 확인

### 원인 4: 포트 바인딩 문제

**증상**: 로그에 포트 관련 오류

**해결**:
1. Dockerfile의 CMD가 올바른지 확인
2. Railway Settings에서 포트 설정 확인

## 빠른 해결 방법

### 방법 1: 재배포

1. Railway 대시보드 → **Deployments**
2. **Redeploy** 클릭
3. 로그 확인

### 방법 2: 환경 변수 재설정

1. Railway → **Variables** 탭
2. 모든 환경 변수 확인 및 재설정
3. 재배포

### 방법 3: 로그 기반 진단

Railway 로그에서 다음을 확인:

1. **앱 시작 메시지**:
   ```
   INFO:     Started server process
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:XXXX
   ```

2. **오류 메시지**:
   - 환경 변수 관련 오류
   - 데이터베이스 연결 오류
   - Python import 오류

## 다음 단계

Railway 로그의 **전체 오류 메시지**를 확인하고 알려주세요. 특히:

1. 앱이 시작되었는지 (`Application startup complete`)
2. 어떤 오류 메시지가 있는지
3. 환경 변수가 모두 설정되었는지

로그 내용을 알려주시면 더 정확한 해결 방법을 제시할 수 있습니다.
