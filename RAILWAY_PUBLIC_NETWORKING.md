# Railway Public Networking 활성화

Private Networking으로 설정되어 있어서 외부에서 접근할 수 없습니다. Public Networking으로 변경해야 합니다.

## 문제 상황

- 현재: **Private Networking** (`household.railway.internal`)
- 문제: 외부에서 접근 불가 (404 오류)
- 해결: **Public Networking**으로 변경 필요

## 해결 방법

### 1단계: Public Networking 활성화

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Networking** 섹션 찾기
4. **Private Networking** 토글 확인:
   - 현재: **ON** (활성화됨)
   - 변경: **OFF** (비활성화)
5. **Public Networking** 토글 확인:
   - 현재: **OFF** (비활성화됨)
   - 변경: **ON** (활성화)
6. **Save** 클릭

### 2단계: 도메인 생성

Public Networking을 활성화한 후:

1. **Settings** → **Networking** → **Domains** 섹션
2. **Generate Domain** 버튼 클릭
3. 포트: `8080` (또는 Auto-detect)
4. 도메인 생성 완료

### 3단계: 재배포

1. **Deployments** 탭
2. **Redeploy** 클릭 (필요시)
3. 새로운 Public 도메인 URL 확인

## 확인 사항

### Public Networking 활성화 후

- ✅ **Public Networking**: ON
- ✅ **Private Networking**: OFF (또는 사용 안 함)
- ✅ **Public Domain**: `https://household-production-1998.up.railway.app` (또는 새로 생성된 도메인)

### Private vs Public

- **Private Networking**: Railway 내부 서비스 간 통신용 (`*.railway.internal`)
- **Public Networking**: 외부 인터넷에서 접근 가능 (`*.up.railway.app`)

## 테스트

Public Networking 활성화 후:

1. **헬스 체크**: `https://your-domain.up.railway.app/health`
2. **API 문서**: `https://your-domain.up.railway.app/docs`
3. **루트 경로**: `https://your-domain.up.railway.app/`

## 참고

- Public Networking을 활성화하면 자동으로 Public 도메인이 생성됩니다
- 기존 Private 도메인(`household.railway.internal`)은 내부 통신용으로 유지됩니다
- Public 도메인은 `https://`로 시작하는 외부 접근 가능한 URL입니다
