# Railway 포트 설정 가이드

Generate Domain 버튼이 활성화되지 않는 경우 포트 설정이 필요합니다.

## 포트 설정 방법

### 방법 1: Settings에서 포트 설정

1. Railway 대시보드 → 프로젝트 → 서비스 선택
2. **Settings** 탭
3. **Networking** 또는 **Port** 섹션 찾기
4. 포트 설정:
   - **Port**: `8000` 입력 (또는 Railway가 제안하는 포트)
   - 또는 **Expose Port**: `8000` 입력

### 방법 2: Public Networking에서 포트 설정

1. **Settings** → **Networking**
2. **Public Networking** 섹션
3. 포트 입력:
   - **Port**: `8000` (Dockerfile의 EXPOSE 포트와 일치)
   - 또는 Railway가 감지한 포트 사용

### 방법 3: 환경 변수로 포트 설정

1. **Variables** 탭
2. **New Variable** 클릭
3. Name: `PORT`
4. Value: `8000`
5. 저장

## 권장 포트

- **8000**: Dockerfile에서 EXPOSE한 포트
- Railway가 자동 감지한 포트 사용 가능

## 확인 사항

포트를 설정한 후:

1. **Public Networking**이 활성화되었는지 확인
2. **Generate Domain** 버튼이 활성화되었는지 확인
3. 도메인 생성

## 참고

- Railway는 내부적으로 `$PORT` 환경 변수를 사용합니다
- 외부 도메인은 표준 HTTPS 포트(443)를 사용합니다
- 설정한 포트는 앱이 리스닝하는 내부 포트입니다

## 다음 단계

포트 설정 후:
1. Generate Domain 클릭
2. 생성된 도메인 URL 확인
3. GitHub Secrets에 추가
