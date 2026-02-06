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
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
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
