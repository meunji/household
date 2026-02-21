import { useState, useEffect, useRef, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { supabase, getCurrentUser } from './auth/supabase'
import Login from './components/Login'
import AssetForm from './components/AssetForm'
import TransactionForm from './components/TransactionForm'
import Summary from './components/Summary'

/**
 * 네비게이션 링크 컴포넌트
 */
function NavLink({ to, children, icon }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link
      to={to}
      style={{
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        color: isActive ? '#FFFFFF' : '#5D4037',
        backgroundColor: isActive 
          ? 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)'
          : '#FFFFFF',
        background: isActive 
          ? 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)'
          : '#FFFFFF',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isActive 
          ? '0 4px 12px rgba(255, 138, 128, 0.3)'
          : '0 2px 4px rgba(93, 64, 55, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 64, 55, 0.12)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(93, 64, 55, 0.08)'
        }
      }}
    >
      {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      {children}
    </Link>
  )
}

/**
 * 메인 App 컴포넌트
 */
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isHandlingCallback, setIsHandlingCallback] = useState(false)
  const callbackHandledRef = useRef(false)

  useEffect(() => {
    // OAuth 리디렉션 후 URL 해시에서 토큰 처리
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (accessToken) {
        // 중복 처리 방지 (useRef 사용)
        if (callbackHandledRef.current) {
          console.log('⏭️ OAuth 콜백 이미 처리됨, 무시')
          return
        }
        
        callbackHandledRef.current = true
        setIsHandlingCallback(true)
        console.log('🔍 OAuth 콜백 감지, 토큰 처리 중...')
        
        // localhost로 리디렉션된 경우 프로덕션 URL로 자동 리디렉션
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          const hash = window.location.hash
          const productionUrl = 'https://meunji.github.io/household/'
          console.log('🔄 localhost 감지, 프로덕션 URL로 리디렉션:', productionUrl + hash)
          window.location.href = productionUrl + hash
          return
        }
        
        // 프로덕션 환경에서 토큰 처리
        console.log('✅ 프로덕션 환경에서 토큰 처리')
        
        const refreshToken = hashParams.get('refresh_token') || ''
        console.log('🔑 토큰 정보:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          tokenLength: accessToken?.length 
        })
        
        // setSession을 비동기로 호출하고 onAuthStateChange가 처리하도록 함
        console.log('🔄 setSession 호출 (onAuthStateChange가 세션 감지 예정)...')
        
        // URL 해시를 먼저 정리 (보안상)
        window.history.replaceState(null, '', window.location.pathname)
        
        // setSession을 비동기로 호출 (타임아웃 없이)
        // onAuthStateChange가 SIGNED_IN 이벤트를 트리거할 것임
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ data: { session }, error }) => {
          console.log('🔄 setSession 응답:', { 
            hasSession: !!session, 
            hasUser: !!session?.user,
            userEmail: session?.user?.email,
            error: error?.message 
          })
          
          if (session?.user) {
            console.log('✅ setSession 성공, onAuthStateChange가 처리할 예정')
          } else if (error) {
            console.error('❌ setSession 실패:', error)
            // 실패 시 getSession으로 재확인
            setTimeout(async () => {
              const { data: { session: retrySession } } = await supabase.auth.getSession()
              if (retrySession?.user) {
                console.log('✅ getSession으로 세션 확인 성공:', retrySession.user.email)
                setUser({ id: retrySession.user.id, email: retrySession.user.email || '' })
                setLoading(false)
                setIsHandlingCallback(false)
              } else {
                console.warn('⚠️ 세션 확인 실패')
                setLoading(false)
                setIsHandlingCallback(false)
              }
            }, 2000)
          }
        }).catch((err) => {
          console.error('❌ setSession 오류:', err)
          // 오류 시 getSession으로 재확인
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            if (retrySession?.user) {
              console.log('✅ getSession으로 세션 확인 성공:', retrySession.user.email)
              setUser({ id: retrySession.user.id, email: retrySession.user.email || '' })
              setLoading(false)
              setIsHandlingCallback(false)
            } else {
              console.warn('⚠️ 세션 확인 실패')
              setLoading(false)
              setIsHandlingCallback(false)
            }
          }, 2000)
        })
        
        // setSession 호출 후 onAuthStateChange가 처리할 때까지 대기
        // 최대 10초 대기 후 타임아웃
        setTimeout(() => {
          if (callbackHandledRef.current) {
            console.warn('⚠️ OAuth 콜백 처리 타임아웃 (10초), getSession으로 재확인...')
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user) {
                console.log('✅ 타임아웃 후 getSession 성공:', session.user.email)
                setUser({ id: session.user.id, email: session.user.email || '' })
              }
              setLoading(false)
              setIsHandlingCallback(false)
            })
          }
        }, 10000)
        
        // setSession 호출 후 onAuthStateChange가 처리할 때까지 로딩 상태 유지
        // return으로 함수 종료하여 "초기 로딩 완료" 로그가 나오지 않도록 함
        // 로딩 상태는 onAuthStateChange에서 처리할 때까지 유지
        return
      }
      
      // OAuth 콜백이 아닌 경우: 로딩을 즉시 종료하고 로그인 화면 표시
      // 사용자가 로그인 버튼을 눌렀을 때만 인증 확인
      // callbackHandledRef를 사용하여 OAuth 콜백 처리 중이 아닐 때만 실행
      if (!callbackHandledRef.current) {
        console.log('ℹ️ 초기 로딩 완료, 로그인 화면 표시')
        setLoading(false)
        
        // 백그라운드에서 빠른 세션 확인 (비동기, 로딩 상태에 영향 없음)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            console.log('✅ 기존 세션 발견:', session.user.email)
            setUser({ id: session.user.id, email: session.user.email || '' })
          } else {
            console.log('ℹ️ 세션 없음, 로그인 필요')
          }
        }).catch((error) => {
          console.log('ℹ️ 세션 확인 중 오류 (무시):', error)
        })
      }
      
      // OAuth 콜백이 아닌 경우: 로딩을 즉시 종료하고 로그인 화면 표시
      // callbackHandledRef를 사용하여 OAuth 콜백 처리 중이 아닐 때만 실행
      if (!callbackHandledRef.current) {
        console.log('ℹ️ 초기 로딩 완료, 로그인 화면 표시')
        setLoading(false)
        
        // 백그라운드에서 빠른 세션 확인 (비동기, 로딩 상태에 영향 없음)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            console.log('✅ 기존 세션 발견:', session.user.email)
            setUser({ id: session.user.id, email: session.user.email || '' })
          } else {
            console.log('ℹ️ 세션 없음, 로그인 필요')
          }
        }).catch((error) => {
          console.log('ℹ️ 세션 확인 중 오류 (무시):', error)
        })
      }
    }

    handleAuthCallback()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session ? 'has session' : 'no session')
      
      // OAuth 콜백 처리 중인 경우
      if (isHandlingCallback && session && _event === 'SIGNED_IN') {
        console.log('✅ SIGNED_IN 이벤트 (OAuth 콜백 처리 중), 사용자 정보 로드 중...')
        setIsHandlingCallback(false)
        await loadUser()
        return
      }
      
      // 일반적인 인증 상태 변경
      if (session && _event === 'SIGNED_IN') {
        console.log('✅ SIGNED_IN 이벤트, 사용자 정보 로드 중...')
        await loadUser()
      } else if (!session && _event === 'SIGNED_OUT') {
        console.log('👋 SIGNED_OUT 이벤트')
        setUser(null)
        setLoading(false)
        setIsHandlingCallback(false)
      } else if (!session) {
        // 세션이 없는 경우 (초기 로딩 또는 로그아웃 후)
        // OAuth 콜백 처리 중이 아닐 때만 로딩 상태 변경
        if (!isHandlingCallback) {
          setUser(null)
          setLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [isHandlingCallback])

  const checkUser = async () => {
    try {
      // OAuth 콜백 처리 중이면 타임아웃 증가
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const isOAuthCallback = !!hashParams.get('access_token')
      
      // OAuth 콜백인 경우 더 긴 타임아웃 (15초)
      // 일반적인 경우 짧은 타임아웃 (5초)
      const timeout = isOAuthCallback ? 15000 : 5000
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('인증 확인 시간 초과')), timeout)
      )
      
      const userPromise = getCurrentUser()
      const currentUser = await Promise.race([userPromise, timeoutPromise])
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      // 타임아웃 오류인 경우 세션에서 직접 확인 시도
      if (error.message === '인증 확인 시간 초과') {
        console.log('⏱️ 타임아웃 발생, 세션에서 직접 확인 시도...')
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            console.log('✅ 세션에서 사용자 정보 확인됨')
            setUser({ id: session.user.id, email: session.user.email || '' })
            setLoading(false)
            return
          }
        } catch (e) {
          console.error('세션 확인 실패:', e)
        }
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      console.log('🔄 사용자 정보 로드 시작...')
      
      // 타임아웃 설정 (5초)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('사용자 정보 로드 시간 초과')), 5000)
      )
      
      const userPromise = getCurrentUser()
      const currentUser = await Promise.race([userPromise, timeoutPromise])
      
      console.log('✅ 사용자 정보 로드 완료:', currentUser)
      
      if (currentUser) {
        setUser(currentUser)
      } else {
        // 세션에서 직접 가져오기 시도
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          console.log('✅ 세션에서 사용자 정보 가져옴')
          setUser({ id: session.user.id, email: session.user.email || '' })
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('❌ 사용자 정보 로드 실패:', error)
      // 세션에서 직접 가져오기 시도
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          console.log('✅ 세션에서 사용자 정보 가져옴 (폴백)')
          setUser({ id: session.user.id, email: session.user.email || '' })
        }
      } catch (e) {
        console.error('❌ 세션에서도 사용자 정보 가져오기 실패:', e)
      }
      setLoading(false)
    }
  }

  const handleLoginSuccess = async () => {
    // 로그인 성공 후 사용자 정보 확인
    console.log('🔄 로그인 성공, 사용자 정보 확인 중...')
    await loadUser()
  }
  
  const handleCheckAuth = async () => {
    // 사용자가 명시적으로 인증 확인을 요청한 경우
    setLoading(true)
    await checkUser()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFBF5 100%)',
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'pulse 2s ease-in-out infinite',
        }}>🏠</div>
        <div style={{
          fontSize: '18px',
          color: '#5D4037',
          fontWeight: '500',
          marginBottom: '8px',
        }}>로딩 중...</div>
        <div style={{
          fontSize: '14px',
          color: '#8D6E63',
        }}>인증 상태를 확인하는 중입니다...</div>
        <button
          onClick={() => {
            setLoading(false)
            setUser(null)
          }}
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            backgroundColor: '#FFFFFF',
            color: '#5D4037',
            border: '2px solid #E0E0E0',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(93, 64, 55, 0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 64, 55, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(93, 64, 55, 0.08)'
          }}
        >
          로그인 화면으로 이동
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFBF5 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
          }}>🏠</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#5D4037',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>아은이네 부자되기</h1>
        </div>
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    )
  }

  return (
    <Router basename="/household">
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFBF5 100%)',
      }}>
        {/* 네비게이션 바 */}
        <nav style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF5 100%)',
          padding: '20px 0',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(93, 64, 55, 0.08)',
          borderBottom: '1px solid rgba(255, 138, 128, 0.1)',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '28px' }}>🏠</span>
              <h1 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#5D4037',
                background: 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>아은이네 부자되기</h1>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <span style={{
                fontSize: '14px',
                color: '#8D6E63',
                fontWeight: '500',
              }}>{user.email}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #FFB3B0 0%, #FF8A80 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(255, 138, 128, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 138, 128, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(255, 138, 128, 0.2)'
                }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </nav>

        {/* 메뉴 */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 30px',
          padding: '0 24px',
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <NavLink to="/summary" icon="📊">요약</NavLink>
            <NavLink to="/assets" icon="💰">자산 관리</NavLink>
            <NavLink to="/transactions" icon="📝">거래 관리</NavLink>
          </div>
        </div>

        {/* 라우트 */}
        <Routes>
          <Route path="/" element={<Navigate to="/summary" replace />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/assets" element={<AssetForm />} />
          <Route path="/transactions" element={<TransactionForm />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
