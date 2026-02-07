# Railway 도메인 생성 시 포트 설정

## 중요: 포트 지정 불필요

Railway에서 **Generate Domain**을 할 때 포트를 지정할 필요가 **없습니다**.

## 이유

1. **자동 포트 관리**: Railway가 내부적으로 포트를 자동으로 관리합니다
2. **표준 포트 사용**: 생성된 도메인은 HTTP/HTTPS 표준 포트(80/443)를 사용합니다
3. **프록시 처리**: Railway가 자동으로 요청을 앱의 `$PORT`로 프록시합니다

## 도메인 생성 방법

1. **Settings** → **Networking** 또는 **Public Networking**
2. **Generate Domain** 클릭
3. **포트는 입력하지 않음** (필드가 있다면 비워두거나 기본값 사용)
4. 도메인 생성 완료

## 작동 원리

```
사용자 요청: https://your-app.up.railway.app/api/health
           ↓
Railway 프록시 (포트 443 → 내부 포트)
           ↓
앱 컨테이너: uvicorn --port $PORT (Railway가 자동 할당)
```

- 외부: 표준 HTTPS 포트 (443)
- 내부: Railway가 할당한 포트 (예: 8080, 3000 등)
- Railway가 자동으로 매핑

## 확인 방법

도메인 생성 후:

1. **헬스 체크**: `https://your-domain.up.railway.app/health`
   - 포트 없이 접속 (표준 HTTPS 포트 사용)
   - 응답: `{"status":"healthy"}`

2. **API 문서**: `https://your-domain.up.railway.app/docs`
   - 포트 없이 접속

## 요약

- ✅ **포트 지정 불필요**: Generate Domain 시 포트 입력하지 않음
- ✅ **자동 관리**: Railway가 포트를 자동으로 관리
- ✅ **표준 포트**: 도메인은 HTTP/HTTPS 표준 포트 사용
- ✅ **프록시**: Railway가 자동으로 프록시 처리

그냥 **Generate Domain** 버튼만 클릭하면 됩니다!
