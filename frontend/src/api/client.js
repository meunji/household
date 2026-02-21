import { getAuthToken } from '../auth/supabase'

/**
 * API 클라이언트 유틸리티
 * Android 앱에서도 동일한 패턴으로 구현 가능
 */

/**
 * 인증 헤더를 포함한 fetch 요청
 * @param {string} url - 요청 URL
 * @param {RequestInit} options - fetch 옵션
 * @returns {Promise<Response>}
 */
const apiRequest = async (url, options = {}) => {
  // 타임아웃 설정 (10초)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn('⚠️ API 요청 타임아웃 (10초):', url)
    controller.abort()
  }, 10000)
  
  try {
    // getAuthToken에 타임아웃 추가
    let token = null
    try {
      const tokenPromise = getAuthToken()
      const tokenTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('토큰 가져오기 타임아웃')), 3000)
      )
      token = await Promise.race([tokenPromise, tokenTimeout])
    } catch (tokenErr) {
      console.warn('⚠️ 토큰 가져오기 실패 (무시):', tokenErr.message)
      // 토큰 없이 진행 (일부 엔드포인트는 토큰이 필요 없을 수 있음)
    }
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // 디버깅을 위한 로그 (항상 표시)
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      headers: { ...headers, Authorization: token ? 'Bearer ***' : 'None' },
      apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    })
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // CORS 쿠키 포함
      signal: controller.signal, // 타임아웃 시 취소
    })
    
    clearTimeout(timeoutId) // 성공 시 타임아웃 취소
    
    if (!response.ok) {
      // 에러 응답 본문 읽기 (본문이 없을 수 있음)
      let error = { detail: response.statusText }
      try {
        const errorText = await response.text()
        if (errorText && errorText.trim().length > 0) {
          error = JSON.parse(errorText)
        }
      } catch (e) {
        // JSON 파싱 실패 시 기본 에러 메시지 사용
        console.warn('에러 응답 파싱 실패:', e)
      }
      
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error,
      })
      
      // 데이터베이스 연결 실패 (503 Service Unavailable)
      if (response.status === 503 && error.detail && error.detail.includes('데이터베이스 연결')) {
        throw new Error(
          `데이터베이스 연결에 실패했습니다.\n\n` +
          `오류: ${error.detail}\n\n` +
          `해결 방법:\n` +
          `1. WSL2 네트워크 재시작: Windows PowerShell에서 'wsl --shutdown' 실행 후 WSL2 재시작\n` +
          `2. 백엔드 서버 재시작: Ctrl+C로 중지 후 'uvicorn app.main:app --reload' 재실행\n` +
          `3. 연결 테스트: 프로젝트 루트에서 'python3 test_db_connection.py' 실행\n` +
          `4. 자세한 해결 방법은 TROUBLESHOOTING_DB.md 파일 참조\n\n` +
          `참고: 현재는 읽기 작업만 가능하며, 데이터 저장은 네트워크 연결이 복구된 후 가능합니다.`
        )
      }
      
      throw new Error(error.detail || `HTTP error! status: ${response.status}`)
    }
    
    // 204 No Content 응답 처리 (본문 없음)
    if (response.status === 204) {
      return null
    }
    
    // 응답 본문 읽기
    const text = await response.text()
    
    // 본문이 비어있으면 null 반환
    if (!text || text.trim().length === 0) {
      return null
    }
    
    // Content-Type 확인하여 JSON 파싱
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      try {
        return JSON.parse(text)
      } catch (e) {
        console.warn('JSON 파싱 실패:', e)
        return null
      }
    }
    
    // JSON이 아닌 경우 텍스트 반환
    return text
  } catch (err) {
    clearTimeout(timeoutId) // 에러 시에도 타임아웃 취소
    
    // AbortError는 타임아웃
    if (err.name === 'AbortError') {
      throw new Error(`API 요청 타임아웃 (10초): ${url}`)
    }
    
    // 네트워크 오류 또는 CORS 오류 처리
    console.error('API Request Failed:', {
      url,
      error: err.message,
      name: err.name,
    })
    
    if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
      throw new Error(
        `API 서버에 연결할 수 없습니다.\n\n` +
        `요청 URL: ${url}\n\n` +
        `가능한 원인:\n` +
        `1. 백엔드 서버가 실행 중인지 확인하세요 (uvicorn app.main:app --reload)\n` +
        `2. 브라우저에서 http://localhost:8000/health 를 직접 열어보세요\n` +
        `3. 브라우저 개발자 도구(F12) > Network 탭에서 요청 상태 확인\n` +
        `4. CORS 설정이 올바른지 확인하세요\n\n` +
        `원본 오류: ${err.message}`
      )
    }
    throw err
  }
}

/**
 * GET 요청
 * @param {string} url - 요청 URL
 * @param {URLSearchParams|Object} params - 쿼리 파라미터
 * @returns {Promise<any>}
 */
export const apiGet = async (url, params = {}) => {
  const urlObj = new URL(url)
  if (params instanceof URLSearchParams) {
    urlObj.search = params.toString()
  } else if (Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlObj.searchParams.append(key, value.toString())
      }
    })
  }
  
  return apiRequest(urlObj.toString())
}

/**
 * POST 요청
 * @param {string} url - 요청 URL
 * @param {Object} data - 요청 본문 데이터
 * @returns {Promise<any>}
 */
export const apiPost = async (url, data) => {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * PUT 요청
 * @param {string} url - 요청 URL
 * @param {Object} data - 요청 본문 데이터
 * @returns {Promise<any>}
 */
export const apiPut = async (url, data) => {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * DELETE 요청
 * @param {string} url - 요청 URL
 * @returns {Promise<void>}
 */
export const apiDelete = async (url) => {
  await apiRequest(url, {
    method: 'DELETE',
  })
}
