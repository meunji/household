/**
 * API 엔드포인트 정의
 * Android 앱에서도 동일한 구조로 사용 가능
 */

// API 기본 URL (환경 변수 또는 기본값)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // 자산 관련
  ASSETS: {
    LIST: `${API_BASE_URL}/api/assets`,
    CREATE: `${API_BASE_URL}/api/assets`,
    GET: (id) => `${API_BASE_URL}/api/assets/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/assets/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/assets/${id}`,
  },
  
  // 거래 관련
  TRANSACTIONS: {
    LIST: `${API_BASE_URL}/api/transactions`,
    CREATE: `${API_BASE_URL}/api/transactions`,
    GET: (id) => `${API_BASE_URL}/api/transactions/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/transactions/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/transactions/${id}`,
  },
  
  // 계산 관련
  CALCULATIONS: {
    SUMMARY: `${API_BASE_URL}/api/calculations/summary`,
    MONTHLY: `${API_BASE_URL}/api/calculations/monthly`,
  },
  
  // 카테고리 관련
  CATEGORIES: {
    LIST: `${API_BASE_URL}/api/categories`,
    ALL: `${API_BASE_URL}/api/categories/all`,
  },
}
