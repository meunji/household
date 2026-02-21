import { useState, useEffect } from 'react'
import { transactionService, categoryService } from '../api/services'

/**
 * 거래(수입/지출) 등록 컴포넌트
 */
export default function TransactionForm() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  
  const [formData, setFormData] = useState({
    type: 'INCOME',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    memo: '',
  })

  useEffect(() => {
    loadTransactions()
    loadCategories(formData.type)
  }, [])

  useEffect(() => {
    loadCategories(formData.type)
    setFormData(prev => ({ ...prev, category_id: '' }))
  }, [formData.type])

  const loadCategories = async (type) => {
    try {
      const data = await categoryService.getCategories(type)
      setCategories(data)
    } catch (err) {
      console.error('카테고리 로드 실패:', err)
    }
  }

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // API 호출 (타임아웃은 apiRequest 내부에서 처리)
      const data = await transactionService.getTransactions()
      
      setTransactions(data || [])
    } catch (err) {
      console.error('거래 로드 오류:', err)
      const errorMessage = err.message || '거래를 불러오는 중 오류가 발생했습니다.'
      
      // 타임아웃인 경우와 실제 오류인 경우 구분
      if (errorMessage.includes('타임아웃')) {
        console.warn('⚠️ 거래 로딩 타임아웃 - 데이터가 없거나 서버 응답이 느립니다')
        setTransactions([]) // 타임아웃 시 빈 배열로 설정 (에러 표시 안함)
      } else {
        setError(errorMessage)
        setTransactions([]) // 오류 시 빈 배열로 설정
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // API 호출 (타임아웃은 apiRequest 내부에서 처리)
      await transactionService.createTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id,
        date: formData.date,
        memo: formData.memo || null,
      })
      
      setFormData({
        type: 'INCOME',
        amount: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
        memo: '',
      })
      
      // 등록 성공 후 데이터 다시 로드
      await loadTransactions()
    } catch (err) {
      console.error('거래 등록 오류:', err)
      setError(err.message || '거래 등록 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      setDeletingId(id)
      setError(null)
      await transactionService.deleteTransaction(id)
      await loadTransactions()
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
        }}>📝 거래 관리</h2>
        <p style={{
          fontSize: '16px',
          color: '#8D6E63',
        }}>수입과 지출을 기록하고 관리하세요</p>
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

      {/* 거래 등록 폼 */}
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
          <span>➕</span> 거래 등록
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#5D4037',
                marginBottom: '8px',
              }}>
                거래 유형
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#5D4037',
                }}
              >
                <option value="INCOME">📈 수입</option>
                <option value="EXPENSE">📉 지출</option>
              </select>
            </div>
            
            <div>
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
                  fontSize: '16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#5D4037',
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#5D4037',
                marginBottom: '8px',
              }}>
                날짜
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#5D4037',
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#5D4037',
              marginBottom: '8px',
            }}>
              카테고리
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#5D4037',
              }}
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#5D4037',
              marginBottom: '8px',
            }}>
              메모 (선택)
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="메모를 입력하세요"
              rows="3"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: '#5D4037',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px',
              background: submitting
                ? 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
                : 'linear-gradient(135deg, #FF8A80 0%, #FF6B6B 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: submitting
                ? 'none'
                : '0 4px 12px rgba(255, 138, 128, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 138, 128, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 138, 128, 0.3)'
              }
            }}
          >
            {submitting ? '등록 중...' : '✅ 등록하기'}
          </button>
        </form>
      </div>

      {/* 거래 목록 */}
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
          <span>📋</span> 거래 목록
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
        {!loading && transactions.length === 0 && (
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
              등록된 거래가 없습니다
            </div>
            <div style={{
              fontSize: '14px',
              color: '#A1887F',
              marginTop: '8px',
            }}>
              위 폼을 사용하여 거래를 등록해보세요
            </div>
          </div>
        )}
        {!loading && transactions.length > 0 && (
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(93, 64, 55, 0.08)',
                  border: '1px solid rgba(255, 138, 128, 0.1)',
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '20px',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: transaction.type === 'INCOME'
                          ? 'rgba(129, 199, 132, 0.2)'
                          : 'rgba(239, 83, 80, 0.2)',
                        color: transaction.type === 'INCOME' ? '#2E7D32' : '#C62828',
                      }}>
                        {transaction.type === 'INCOME' ? '📈 수입' : '📉 지출'}
                      </span>
                      {transaction.category?.name && (
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          backgroundColor: 'rgba(100, 181, 246, 0.2)',
                          color: '#1565C0',
                        }}>
                          {transaction.category.name}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: transaction.type === 'INCOME' ? '#2E7D32' : '#C62828',
                      marginBottom: '8px',
                    }}>
                      {transaction.type === 'INCOME' ? '+' : '-'} {formatAmount(transaction.amount)}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#8D6E63',
                      marginBottom: '4px',
                    }}>
                      📅 {formatDate(transaction.date)}
                    </div>
                    {transaction.memo && (
                      <div style={{
                        fontSize: '14px',
                        color: '#A1887F',
                        marginTop: '8px',
                        fontStyle: 'italic',
                      }}>
                        💭 {transaction.memo}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: deletingId === transaction.id ? '#BDBDBD' : '#FFFFFF',
                      color: deletingId === transaction.id ? '#FFFFFF' : '#EF5350',
                      border: deletingId === transaction.id ? 'none' : '2px solid #EF5350',
                      borderRadius: '12px',
                      cursor: deletingId === transaction.id ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      boxShadow: deletingId === transaction.id
                        ? 'none'
                        : '0 2px 4px rgba(239, 83, 80, 0.2)',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== transaction.id) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 83, 80, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (deletingId !== transaction.id) {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 83, 80, 0.2)'
                      }
                    }}
                  >
                    {deletingId === transaction.id ? '삭제 중...' : '🗑️ 삭제'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
