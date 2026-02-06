import { useState, useEffect } from 'react'
import { calculationService } from '../api/services'

/**
 * 요약 화면 컴포넌트
 * 총 자산, 총 부채, 순자산, 이번 달 수입/지출 표시
 */
export default function Summary() {
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [summaryData, monthlyData] = await Promise.all([
        calculationService.getSummary(),
        calculationService.getMonthlySummary(),
      ])
      
      setSummary(summaryData)
      setMonthly(monthlyData)
    } catch (err) {
      console.error('API 호출 오류:', err)
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

  if (loading) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'pulse 2s ease-in-out infinite',
        }}>📊</div>
        <div style={{
          fontSize: '18px',
          color: '#5D4037',
          fontWeight: '500',
        }}>데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#FFFFFF',
          border: '2px solid #FFB3B0',
          borderRadius: '16px',
          color: '#721c24',
          whiteSpace: 'pre-line',
          lineHeight: '1.6',
          boxShadow: '0 4px 12px rgba(93, 64, 55, 0.08)',
        }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '12px',
          }}>⚠️</div>
          <strong style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '18px',
            color: '#5D4037',
          }}>오류 발생</strong>
          <div style={{ color: '#8D6E63' }}>{error}</div>
        </div>
        <button
          onClick={loadData}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '16px',
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
          다시 시도
        </button>
      </div>
    )
  }

  const Card = ({ icon, title, amount, color, bgColor }) => (
    <div style={{
      padding: '28px',
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: `2px solid ${bgColor}`,
      boxShadow: '0 4px 12px rgba(93, 64, 55, 0.08)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(93, 64, 55, 0.12)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 64, 55, 0.08)'
    }}
    >
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${bgColor}20 0%, ${bgColor}10 100%)`,
        zIndex: 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '32px',
          marginBottom: '12px',
        }}>{icon}</div>
        <div style={{
          fontSize: '14px',
          color: '#8D6E63',
          marginBottom: '8px',
          fontWeight: '500',
        }}>{title}</div>
        <div style={{
          fontSize: '28px',
          fontWeight: '700',
          color: color,
          lineHeight: '1.2',
        }}>
          {amount}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{
      padding: '0 24px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div style={{
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#5D4037',
          marginBottom: '8px',
        }}>자산 요약</h2>
        <p style={{
          fontSize: '16px',
          color: '#8D6E63',
        }}>우리 가족의 자산 현황을 한눈에 확인하세요</p>
      </div>
      
      {/* 전체 요약 카드 */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#5D4037',
          marginBottom: '20px',
          paddingLeft: '8px',
        }}>전체 자산 현황</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          <Card
            icon="💰"
            title="총 자산"
            amount={summary ? formatAmount(summary.total_assets) : '-'}
            color="#2E7D32"
            bgColor="#81C784"
          />
          
          <Card
            icon="📋"
            title="총 부채"
            amount={summary ? formatAmount(summary.total_liabilities) : '-'}
            color="#C62828"
            bgColor="#EF5350"
          />
          
          <Card
            icon="✨"
            title="순자산"
            amount={summary ? formatAmount(summary.net_worth) : '-'}
            color={summary && summary.net_worth >= 0 ? '#1565C0' : '#E65100'}
            bgColor={summary && summary.net_worth >= 0 ? '#64B5F6' : '#FFB74D'}
          />
        </div>
      </div>

      {/* 월별 요약 카드 */}
      <div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#5D4037',
          marginBottom: '20px',
          paddingLeft: '8px',
        }}>
          {monthly ? `${monthly.year}년 ${monthly.month}월` : '이번 달'} 수입/지출
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          <Card
            icon="📈"
            title="수입 합계"
            amount={monthly ? formatAmount(monthly.total_income) : '-'}
            color="#2E7D32"
            bgColor="#81C784"
          />
          
          <Card
            icon="📉"
            title="지출 합계"
            amount={monthly ? formatAmount(monthly.total_expense) : '-'}
            color="#C62828"
            bgColor="#EF5350"
          />
          
          <Card
            icon="💵"
            title="순수입"
            amount={monthly
              ? formatAmount(monthly.total_income - monthly.total_expense)
              : '-'}
            color="#1565C0"
            bgColor="#64B5F6"
          />
        </div>
      </div>

      {/* 새로고침 버튼 */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center',
      }}>
        <button
          onClick={loadData}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(255, 138, 128, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 138, 128, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 138, 128, 0.3)'
          }}
        >
          <span>🔄</span>
          새로고침
        </button>
      </div>
    </div>
  )
}
