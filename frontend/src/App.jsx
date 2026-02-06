import { useState, useEffect } from 'react'
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

  useEffect(() => {
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session ? 'has session' : 'no session')
      if (session) {
        await loadUser()
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('인증 확인 시간 초과')), 5000)
      )
      
      const userPromise = getCurrentUser()
      const currentUser = await Promise.race([userPromise, timeoutPromise])
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    } catch (error) {
      console.error('Error loading user:', error)
      setUser(null)
      setLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    loadUser()
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
