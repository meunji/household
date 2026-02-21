import { useState, useEffect } from 'react'
import { assetService } from '../api/services'

/**
 * 자산 등록 컴포넌트
 */
export default function AssetForm() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    type: 'CASH',
    name: '',
    amount: '',
  })

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 타임아웃 추가 (30초)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('데이터 로딩 타임아웃')), 30000)
      )
      
      const data = await Promise.race([
        assetService.getAssets(),
        timeoutPromise,
      ])
      
      setAssets(data)
    } catch (err) {
      console.error('자산 로드 오류:', err)
      setError(err.message || '자산을 불러오는 중 오류가 발생했습니다.')
      setAssets([]) // 오류 시 빈 배열로 설정
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // 타임아웃 추가 (30초)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('등록 타임아웃')), 30000)
      )
      
      try {
        await Promise.race([
          assetService.createAsset({
            type: formData.type,
            name: formData.name,
            amount: parseFloat(formData.amount),
          }),
          timeoutPromise,
        ])
        
        setFormData({
          type: 'CASH',
          name: '',
          amount: '',
        })
        
        // 등록 성공 후 데이터 다시 로드
        await loadAssets()
      } catch (timeoutErr) {
        // 타임아웃 발생 시에도 데이터가 등록되었을 수 있으므로 다시 로드 시도
        if (timeoutErr.message === '등록 타임아웃') {
          console.warn('⚠️ 등록 타임아웃 발생, 데이터 다시 로드 시도...')
          // 폼은 리셋하고 데이터만 다시 로드
          setFormData({
            type: 'CASH',
            name: '',
            amount: '',
          })
          // 백그라운드에서 데이터 다시 로드 (에러 무시)
          loadAssets().catch(() => {
            // 무시
          })
          // 타임아웃 에러를 다시 throw하여 사용자에게 알림
          throw timeoutErr
        }
        throw timeoutErr
      }
    } catch (err) {
      console.error('자산 등록 오류:', err)
      setError(err.message || '자산 등록 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      setDeletingId(id)
      setError(null)
      await assetService.deleteAsset(id)
      await loadAssets()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

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
        }}>💰 자산 관리</h2>
        <p style={{
          fontSize: '16px',
          color: '#8D6E63',
        }}>가족의 자산을 등록하고 관리하세요</p>
      </div>
      
      {error && (
        <div style={{
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#FFFFFF',
          border: '2px solid #FFB3B0',
          borderRadius: '16px',
          color: '#C62828',
          boxShadow: '0 4px 12px rgba(93, 64, 55, 0.08)',
        }}>
          <div style={{
            fontSize: '20px',
            marginBottom: '8px',
          }}>⚠️</div>
          {error}
        </div>
      )}

      {/* 자산 등록 폼 */}
      <div style={{
        marginBottom: '40px',
        padding: '32px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(93, 64, 55, 0.08)',
        border: '1px solid rgba(255, 138, 128, 0.1)',
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#5D4037',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>➕</span> 자산 등록
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#5D4037',
              marginBottom: '8px',
            }}>
              자산 유형
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                marginTop: '4px',
                fontSize: '16px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#5D4037',
                transition: 'all 0.3s ease',
              }}
            >
              <option value="CASH">💵 현금</option>
              <option value="LOAN">📋 대출</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#5D4037',
              marginBottom: '8px',
            }}>
              자산명
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="예: 현금, 주택담보대출"
              style={{
                width: '100%',
                padding: '14px 16px',
                marginTop: '4px',
                fontSize: '16px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#5D4037',
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#5D4037',
              marginBottom: '8px',
            }}>
              금액
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="0"
              step="0.01"
              placeholder="0"
              style={{
                width: '100%',
                padding: '14px 16px',
                marginTop: '4px',
                fontSize: '16px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#5D4037',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || loading}
            style={{
              width: '100%',
              padding: '16px',
              background: (submitting || loading)
                ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
                : 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              cursor: (submitting || loading) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: (submitting || loading)
                ? 'none'
                : '0 4px 12px rgba(255, 138, 128, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!submitting && !loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 138, 128, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting && !loading) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 138, 128, 0.3)'
              }
            }}
          >
            {submitting ? '등록 중...' : '✅ 등록하기'}
          </button>
        </form>
      </div>

      {/* 자산 목록 */}
      <div>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#5D4037',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>📋</span> 자산 목록
        </h3>
        {loading && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#8D6E63',
            fontSize: '16px',
          }}>
            로딩 중...
          </div>
        )}
        {!loading && assets.length === 0 && (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(93, 64, 55, 0.08)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <div style={{
              fontSize: '18px',
              color: '#8D6E63',
              fontWeight: '500',
            }}>
              등록된 자산이 없습니다
            </div>
            <div style={{
              fontSize: '14px',
              color: '#A1887F',
              marginTop: '8px',
            }}>
              위 폼을 사용하여 자산을 등록해보세요
            </div>
          </div>
        )}
        {!loading && assets.length > 0 && (
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {assets.map((asset) => (
              <div
                key={asset.id}
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(93, 64, 55, 0.08)',
                  border: '1px solid rgba(255, 138, 128, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 64, 55, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(93, 64, 55, 0.08)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backgroundColor: asset.type === 'CASH'
                        ? 'rgba(129, 199, 132, 0.2)'
                        : 'rgba(239, 83, 80, 0.2)',
                      color: asset.type === 'CASH' ? '#2E7D32' : '#C62828',
                    }}>
                      {asset.type === 'CASH' ? '💵 현금' : '📋 대출'}
                    </span>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#5D4037',
                    }}>
                      {asset.name}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#5D4037',
                  }}>
                    {formatAmount(asset.amount)}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(asset.id)}
                  disabled={deletingId === asset.id}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: deletingId === asset.id ? '#BDBDBD' : '#FFFFFF',
                    color: deletingId === asset.id ? '#FFFFFF' : '#EF5350',
                    border: deletingId === asset.id ? 'none' : '2px solid #EF5350',
                    borderRadius: '12px',
                    cursor: deletingId === asset.id ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    boxShadow: deletingId === asset.id
                      ? 'none'
                      : '0 2px 4px rgba(239, 83, 80, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    if (deletingId !== asset.id) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 83, 80, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (deletingId !== asset.id) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 83, 80, 0.2)'
                    }
                  }}
                >
                  {deletingId === asset.id ? '삭제 중...' : '🗑️ 삭제'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
