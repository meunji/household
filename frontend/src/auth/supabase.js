import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * 현재 사용자의 JWT 토큰을 가져옵니다.
 * @returns {Promise<string|null>} JWT 토큰 또는 null
 */
export const getAuthToken = async () => {
  // localStorage에서 저장된 토큰 먼저 확인
  const storedToken = localStorage.getItem('supabase_auth_token')
  if (storedToken) {
    console.log('🔑 저장된 토큰 사용')
    return storedToken
  }
  
  // 저장된 토큰이 없으면 getSession 시도 (타임아웃 포함)
  try {
    const sessionPromise = supabase.auth.getSession()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('getSession 타임아웃')), 3000)
    )
    
    const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise])
    
    if (session?.access_token) {
      // 토큰을 localStorage에 저장
      localStorage.setItem('supabase_auth_token', session.access_token)
      console.log('🔑 세션에서 토큰 가져옴')
      return session.access_token
    }
    
    return null
  } catch (err) {
    console.warn('⚠️ getSession 타임아웃 또는 오류:', err.message)
    return null
  }
}

/**
 * 토큰을 저장합니다 (OAuth 콜백 후 사용)
 * @param {string} token - JWT 토큰
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('supabase_auth_token', token)
    console.log('🔑 토큰 저장됨')
  }
}

/**
 * 저장된 토큰을 삭제합니다 (로그아웃 시 사용)
 */
export const clearAuthToken = () => {
  localStorage.removeItem('supabase_auth_token')
  console.log('🔑 토큰 삭제됨')
}

/**
 * 현재 사용자 정보를 가져옵니다.
 * @returns {Promise<{id: string, email: string} | null>}
 */
export const getCurrentUser = async () => {
  try {
    // 먼저 세션 확인 (더 빠름)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      return { id: session.user.id, email: session.user.email || '' }
    }
    
    // 세션이 없으면 사용자 정보 직접 가져오기
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    return user ? { id: user.id, email: user.email || '' } : null
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}
