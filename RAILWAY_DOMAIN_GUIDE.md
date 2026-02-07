# Railway 도메인 찾기 가이드

배포가 성공했지만 도메인을 찾는 방법입니다.

## 방법 1: 서비스 메인 페이지에서 확인

1. Railway 대시보드 → 프로젝트 선택
2. 배포된 서비스 클릭
3. 서비스 메인 페이지 상단에서 확인:
   - **Public URL** 또는 **Domain** 섹션
   - 또는 상단에 URL이 직접 표시될 수 있음

## 방법 2: Settings 탭에서 확인

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭 클릭
3. 다음 섹션들을 확인:
   - **Networking** 섹션
   - **Domains** 섹션 (하단에 있을 수 있음)
   - **Public Networking** 섹션

## 방법 3: 도메인 생성 (자동 생성되지 않은 경우)

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Networking** 또는 **Public Networking** 섹션 찾기
4. **Generate Domain** 또는 **Create Domain** 버튼 클릭
5. 생성된 도메인 확인 (예: `your-service-name.up.railway.app`)

## 방법 4: 배포 로그에서 확인

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Deployments** 탭
3. 최신 배포 클릭
4. **Logs** 탭에서 URL 확인:
   - `https://`로 시작하는 URL 찾기
   - 또는 Railway가 자동으로 생성한 도메인 확인

## 방법 5: Railway CLI 사용 (선택사항)

Railway CLI가 설치되어 있다면:

```bash
railway status
```

또는:

```bash
railway domain
```

## 일반적인 Railway 도메인 형식

Railway가 생성하는 도메인은 보통 다음과 같은 형식입니다:

- `https://your-service-name.up.railway.app`
- `https://your-project-name-production.up.railway.app`
- `https://railway.app/project/xxx/service/xxx`

## 도메인이 보이지 않는 경우

### Public Networking 활성화

1. **Settings** 탭
2. **Networking** 섹션 찾기
3. **Public Networking** 토글이 **OFF**인지 확인
4. **ON**으로 변경
5. 도메인 자동 생성 대기

### 수동으로 도메인 생성

1. **Settings** → **Networking**
2. **Generate Domain** 버튼 클릭
3. 생성된 도메인 복사

## 확인 방법

도메인을 찾았다면 브라우저에서 테스트:

1. **헬스 체크**: `https://your-domain.railway.app/health`
   - 응답: `{"status":"healthy"}`

2. **API 문서**: `https://your-domain.railway.app/docs`
   - Swagger UI가 표시되는지 확인

## 다음 단계

도메인을 찾았다면:

1. 도메인 URL 복사 (예: `https://your-service.up.railway.app`)
2. GitHub Secrets에 추가:
   - Settings → Secrets and variables → Actions
   - Name: `VITE_API_URL`
   - Value: 도메인 URL (끝에 `/` 없이)
3. 프론트엔드 재배포

## 스크린샷 위치

Railway UI에서 도메인은 보통 다음 위치에 있습니다:

- 서비스 메인 페이지 상단 (가장 흔함)
- Settings → Networking 섹션
- Settings → Domains 섹션 (하단)

UI가 변경되었을 수 있으니, 위의 모든 위치를 확인해보세요.
