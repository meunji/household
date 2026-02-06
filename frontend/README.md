# 가족 자산관리 및 가계부 프론트엔드

FastAPI 백엔드를 테스트하기 위한 MVP 수준의 웹 프론트엔드입니다.

## 특징

- **API 호출 구조 명확**: Android 앱으로 전환 시 동일한 구조로 구현 가능
- **토큰 처리 분리**: API 클라이언트와 인증 로직이 명확히 분리됨
- **단순한 상태 관리**: useState/useEffect만 사용
- **기능 위주 디자인**: MVP 수준의 간단한 UI

## 프로젝트 구조

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js          # API 호출 유틸리티 (토큰 처리 포함)
│   │   ├── endpoints.js       # API 엔드포인트 정의
│   │   └── services.js        # 도메인별 API 서비스 함수
│   ├── auth/
│   │   └── supabase.js        # Supabase 인증 설정 및 유틸리티
│   ├── components/
│   │   ├── Login.jsx          # 로그인 컴포넌트
│   │   ├── Register.jsx       # 회원가입 컴포넌트
│   │   ├── AssetForm.jsx      # 자산 등록 컴포넌트
│   │   ├── TransactionForm.jsx # 거래 등록 컴포넌트
│   │   └── Summary.jsx        # 요약 화면 컴포넌트
│   ├── App.jsx                # 메인 App 컴포넌트 및 라우팅
│   └── main.jsx               # 진입점
├── .env                       # 환경 변수 (Supabase 설정)
└── package.json
```

## 설치 및 실행

### 1. 의존성 설치

```bash
cd frontend
npm install
```

### 2. 환경 변수 설정

`.env` 파일이 이미 생성되어 있습니다. 필요시 수정하세요:

```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 빌드

```bash
npm run build
```

## API 호출 구조

### Android 앱에서 참고할 구조

#### 1. 엔드포인트 정의 (`src/api/endpoints.js`)
```javascript
export const API_ENDPOINTS = {
  ASSETS: {
    LIST: `${API_BASE_URL}/api/assets`,
    CREATE: `${API_BASE_URL}/api/assets`,
    // ...
  }
}
```

#### 2. API 클라이언트 (`src/api/client.js`)
```javascript
// JWT 토큰을 자동으로 포함하여 요청
const apiRequest = async (url, options = {}) => {
  const token = await getAuthToken()
  headers['Authorization'] = `Bearer ${token}`
  // ...
}
```

#### 3. 서비스 레이어 (`src/api/services.js`)
```javascript
export const assetService = {
  getAssets: async () => apiGet(API_ENDPOINTS.ASSETS.LIST),
  createAsset: async (data) => apiPost(API_ENDPOINTS.ASSETS.CREATE, data),
  // ...
}
```

#### 4. 컴포넌트에서 사용
```javascript
import { assetService } from '../api/services'

const data = await assetService.getAssets()
```

## 화면 구성

1. **로그인/회원가입**: Supabase 인증 사용
2. **요약 화면**: 총 자산, 총 부채, 순자산, 이번 달 수입/지출
3. **자산 관리**: 현금/대출 등록 및 목록 조회
4. **거래 관리**: 수입/지출 등록 및 목록 조회

## Android 앱 전환 가이드

### 1. API 호출 구조
- `src/api/endpoints.js`: 엔드포인트 URL 정의 → Android의 `ApiEndpoints` 클래스
- `src/api/client.js`: HTTP 클라이언트 → Android의 Retrofit/OkHttp
- `src/api/services.js`: 서비스 함수 → Android의 Repository 패턴

### 2. 인증 처리
- `src/auth/supabase.js`: Supabase 클라이언트 → Android의 Supabase SDK
- JWT 토큰은 `Authorization: Bearer <token>` 헤더로 전달

### 3. 상태 관리
- React의 `useState` → Android의 `StateFlow` / `LiveData`
- React의 `useEffect` → Android의 `LifecycleObserver` / `ViewModel`

### 4. 화면 구성
- React Router → Android의 Navigation Component
- 각 컴포넌트 → Android의 Fragment/Activity

## 주요 기능

- ✅ Supabase 인증 (로그인/회원가입)
- ✅ 자산 등록 및 조회 (현금, 대출)
- ✅ 거래 등록 및 조회 (수입, 지출)
- ✅ 자산 요약 (총 자산, 총 부채, 순자산)
- ✅ 월별 수입/지출 합계

## 참고사항

- 이 프론트엔드는 MVP 수준으로 기능 검증에 집중합니다
- 디자인은 최소한으로 구현되어 있습니다
- Android 앱 개발 시 API 호출 구조를 그대로 참고할 수 있습니다
