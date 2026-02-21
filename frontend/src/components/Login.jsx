import { useState, useEffect } from 'react'
import { supabase } from '../auth/supabase'

/**
 * Google 소셜 로그인 컴포넌트
 */
export default function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // 현재 환경에 맞는 리디렉션 URL 설정
      // GitHub Pages: /household/ 경로 포함
      // 로컬 개발: / 경로
      const basename = window.location.pathname.startsWith('/household/') ? '/household' : ''
      const redirectTo = `${window.location.origin}${basename}/`
      
      console.log('🔍 OAuth 시작:', {
        currentUrl: window.location.href,
        redirectTo: redirectTo,
        basename: basename,
      })
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          skipBrowserRedirect: false, // 브라우저 리디렉션 명시적으로 활성화
        },
      })
      
      console.log('🔍 OAuth 응답:', { data, error })
      
      // OAuth가 성공하면 data.url로 리디렉션됨
      if (data?.url) {
        console.log('✅ OAuth URL 생성됨, 리디렉션:', data.url)
        // 브라우저가 자동으로 리디렉션됨
        return
      }

      if (error) {
        if (error.message && error.message.includes('not enabled')) {
          throw new Error(
            'Google 로그인이 활성화되지 않았습니다. Supabase 대시보드에서 Google 제공자를 활성화해주세요.'
          )
        }
        if (error.message && error.message.includes('redirect_uri_mismatch')) {
          throw new Error(
            '리디렉션 URI가 일치하지 않습니다.\n\n' +
            'Google Cloud Console에서 다음 URI를 승인된 리디렉션 URI에 추가해주세요:\n' +
            'https://fqgcxjddhddcrbazuseu.supabase.co/auth/v1/callback\n\n' +
            '설정 방법:\n' +
            '1. Google Cloud Console > API 및 서비스 > 사용자 인증 정보\n' +
            '2. OAuth 클라이언트 ID 클릭\n' +
            '3. 승인된 리디렉션 URI에 위 URL 추가\n' +
            '4. 저장\n\n' +
            '참고: 개발 환경(localhost)과 프로덕션 환경 모두 필요할 수 있습니다.'
          )
        }
        throw error
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      padding: isMobile ? '24px 24px 16px 24px' : '40px 40px 20px 40px',
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(93, 64, 55, 0.12)',
      border: '1px solid rgba(255, 138, 128, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: isMobile ? '400px' : '600px',
      maxHeight: isMobile ? '100vh' : 'none',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 배경 이미지 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${import.meta.env.BASE_URL}img/fam.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.95,
        zIndex: 0,
      }} />
      
      {/* 오버레이 그라데이션 (텍스트 가독성 향상) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.8) 100%)',
        zIndex: 1,
      }} />
      
      {/* 콘텐츠 영역 */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '20px' : '32px',
          marginTop: isMobile ? '5px' : '10px',
        }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: '400',
            fontFamily: "'Jua', 'Dongle', 'Noto Sans KR', sans-serif",
            background: 'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(255, 255, 255, 0.9)',
            letterSpacing: '0.5px',
          }}>잘살아보세</h2>
        </div>
      
        {error && (
          <div style={{
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: 'rgba(255, 243, 224, 0.95)',
            border: '2px solid #FFB3B0',
            borderRadius: '16px',
            color: '#C62828',
            fontSize: '14px',
            whiteSpace: 'pre-line',
            lineHeight: '1.6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              fontSize: '20px',
              marginBottom: '8px',
            }}>⚠️</div>
            <strong style={{
              display: 'block',
              marginBottom: '8px',
              color: '#5D4037',
            }}>오류 발생</strong>
            {error}
          </div>
        )}
      
        <div style={{ flex: 1 }} /> {/* 공간 확보 */}
      </div>
      
      {/* 구글 로그인 버튼 - 배경 이미지 하단 고정 */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: isMobile ? 'calc(100% - 48px)' : 'calc(100% - 80px)',
          padding: isMobile ? '14px 20px' : '16px 24px',
          position: 'absolute',
          bottom: isMobile ? '16px' : '32px',
          left: isMobile ? '24px' : '40px',
          right: isMobile ? '24px' : '40px',
          fontSize: isMobile ? '14px' : '16px',
          background: loading
            ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
            : 'linear-gradient(135deg, #4285f4 0%, #357ae8 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          transition: 'all 0.3s ease',
          boxShadow: loading
            ? 'none'
            : '0 4px 12px rgba(66, 133, 244, 0.4)',
          zIndex: 3,
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(66, 133, 244, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)'
          }
        }}
      >
        {loading ? (
          '로그인 중...'
        ) : (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google로 로그인
          </>
        )}
      </button>
    </div>
  )
}
