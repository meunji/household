# Railway 502 Bad Gateway 진단

Public Networking으로 변경했지만 여전히 502 오류가 발생하는 경우 진단 방법입니다.

## 즉시 확인 사항

### 1. Railway 로그 확인 (가장 중요)

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Deployments** 탭 → 최신 배포 클릭
3. **Logs** 탭 확인

다음을 확인하세요:

#### 정상적인 경우:
```
INFO:     Started server process [X]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:XXXX
```

#### 문제가 있는 경우:
- ❌ 앱 시작 오류 메시지
- ❌ 환경 변수 관련 오류
- ❌ 데이터베이스 연결 오류
- ❌ Python import 오류

### 2. Railway Settings 확인

1. **Settings** → **Networking**
2. **Port**: 로그에서 확인한 포트와 일치하는지 확인
   - 로그: `Uvicorn running on http://0.0.0.0:8080`
   - Settings Port: `8080` (일치해야 함)
3. **Public Networking**: ON인지 확인

### 3. 환경 변수 확인

**Variables** 탭에서 다음이 모두 있는지 확인:

```
DATABASE_URL=postgresql+asyncpg://...
SUPABASE_URL=https://fqgcxjddhddcrbazuseu.supabase.co
SUPABASE_KEY=sb_publishable_4vlOhELxcerQ4g89Il6oqA_9YcfOcsr
ENVIRONMENT=production
ALLOWED_ORIGINS=https://meunji.github.io
PORT=8000
```

## 일반적인 원인

### 원인 1: 앱 시작 실패

앱이 시작되다가 크래시되었을 수 있습니다.

**확인**: Railway 로그에서 앱 시작 오류 확인

**해결**: 로그의 오류 메시지에 따라 수정

### 원인 2: 포트 불일치

Railway Settings의 포트와 앱이 리스닝하는 포트가 다를 수 있습니다.

**확인**: 
- 로그: `Uvicorn running on http://0.0.0.0:XXXX`
- Settings Port: `XXXX` (일치해야 함)

**해결**: Settings Port를 로그의 포트와 일치시키기

### 원인 3: 환경 변수 누락

필수 환경 변수가 없어서 앱이 시작하지 못할 수 있습니다.

**확인**: Variables 탭에서 모든 환경 변수 확인

**해결**: 누락된 환경 변수 추가

### 원인 4: 데이터베이스 연결 실패

앱 시작 시 데이터베이스 연결을 시도하다가 실패할 수 있습니다.

**확인**: 로그에서 데이터베이스 연결 오류 확인

**해결**: DATABASE_URL 확인 및 Supabase 연결 테스트

## 빠른 해결 방법

### 방법 1: 재배포

1. **Deployments** 탭
2. **Redeploy** 클릭
3. 로그 확인

### 방법 2: 포트 재설정

1. **Settings** → **Networking**
2. **Port**: 로그에서 확인한 포트로 설정
3. 저장
4. 재배포

### 방법 3: 환경 변수 재설정

1. **Variables** 탭
2. 모든 환경 변수 확인 및 재설정
3. 재배포

## 다음 단계

Railway 로그의 **전체 내용**을 확인하고 알려주세요. 특히:

1. 앱이 시작되었는지 (`Application startup complete`)
2. 어떤 포트에서 리스닝하는지 (`Uvicorn running on http://0.0.0.0:XXXX`)
3. 오류 메시지가 있는지

로그 내용을 알려주시면 더 정확한 해결 방법을 제시할 수 있습니다.
