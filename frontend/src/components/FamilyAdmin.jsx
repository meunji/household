import { useState, useEffect } from 'react'
import { familyService } from '../api/services'

/**
 * 가족 관리 화면 컴포넌트
 * 가족 그룹 생성, 구성원 추가/삭제 기능 제공
 */
export default function FamilyAdmin() {
  const [familyGroup, setFamilyGroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  useEffect(() => {
    loadFamilyGroup()
  }, [])

  const loadFamilyGroup = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await familyService.getMyFamilyGroup()
      setFamilyGroup(data)
    } catch (err) {
      console.error('가족 그룹 로드 오류:', err)
      if (err.message?.includes('404') || err.message?.includes('찾을 수 없습니다')) {
        // 가족 그룹이 없는 경우 (정상)
        setFamilyGroup(null)
      } else {
        setError(err.message || '가족 그룹을 불러오는 중 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFamilyGroup = async () => {
    if (!newGroupName.trim()) {
      setError('가족 그룹 이름을 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const data = await familyService.createFamilyGroup({ name: newGroupName })
      setFamilyGroup(data)
      setShowCreateForm(false)
      setNewGroupName('')
    } catch (err) {
      console.error('가족 그룹 생성 오류:', err)
      setError(err.message || '가족 그룹 생성 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setError('이메일 주소를 입력해주세요.')
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newMemberEmail.trim())) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }

    if (!familyGroup) {
      setError('가족 그룹이 없습니다.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      await familyService.addFamilyMember(familyGroup.id, {
        email: newMemberEmail.trim().toLowerCase(),
        role: 'MEMBER',
      })
      // 가족 그룹 다시 로드
      await loadFamilyGroup()
      setNewMemberEmail('')
    } catch (err) {
      console.error('구성원 추가 오류:', err)
      setError(err.message || '구성원 추가 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveMember = async (memberUserId) => {
    if (!familyGroup) {
      setError('가족 그룹이 없습니다.')
      return
    }

    if (!confirm('정말 이 구성원을 제거하시겠습니까?')) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      await familyService.removeFamilyMember(familyGroup.id, memberUserId)
      // 가족 그룹 다시 로드
      await loadFamilyGroup()
    } catch (err) {
      console.error('구성원 제거 오류:', err)
      setError(err.message || '구성원 제거 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#5D4037' }}>가족 그룹 정보를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#5D4037', marginBottom: '24px' }}>
        가족 관리
      </h1>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#FFEBEE',
            color: '#C62828',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          {error}
        </div>
      )}

      {!familyGroup ? (
        <div
          style={{
            padding: '32px',
            backgroundColor: '#FFF9E6',
            borderRadius: '12px',
            border: '2px dashed #FFB74D',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#5D4037', marginBottom: '16px' }}>
            가족 그룹이 없습니다
          </h2>
          <p style={{ color: '#757575', marginBottom: '24px' }}>
            가족 그룹을 생성하면 구성원들과 자산 및 거래 정보를 공유할 수 있습니다.
          </p>

          {showCreateForm ? (
            <div>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="가족 그룹 이름 (예: 아은이네)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #FFB74D',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFamilyGroup()
                  }
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCreateFamilyGroup}
                  disabled={submitting}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    backgroundColor: '#FF8A80',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? '생성 중...' : '생성하기'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewGroupName('')
                  }}
                  disabled={submitting}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#5D4037',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
                backgroundColor: '#FF8A80',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              가족 그룹 생성하기
            </button>
          )}
        </div>
      ) : (
        <div>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#F5F5F5',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#5D4037', marginBottom: '8px' }}>
              {familyGroup.name}
            </h2>
            <p style={{ color: '#757575', fontSize: '14px' }}>
              관리자: {familyGroup.admin_user_id}
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#5D4037', marginBottom: '16px' }}>
              구성원 목록
            </h3>

            <div style={{ marginBottom: '24px' }}>
              {familyGroup.members && familyGroup.members.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {familyGroup.members.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #E0E0E0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: '#5D4037', marginBottom: '4px' }}>
                          {member.user_id}
                        </div>
                        <div style={{ fontSize: '14px', color: '#757575' }}>
                          {member.role === 'ADMIN' ? '관리자' : '구성원'}
                        </div>
                      </div>
                      {member.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleRemoveMember(member.user_id)}
                          disabled={submitting}
                          style={{
                            padding: '8px 16px',
                            fontSize: '14px',
                            color: '#C62828',
                            backgroundColor: '#FFEBEE',
                            border: '1px solid #EF9A9A',
                            borderRadius: '6px',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.6 : 1,
                          }}
                        >
                          제거
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#757575' }}>
                  구성원이 없습니다.
                </div>
              )}
            </div>

            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#5D4037', marginBottom: '12px' }}>
                구성원 추가
              </h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="추가할 사용자의 이메일 주소 입력 (예: user@gmail.com)"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddMember()
                    }
                  }}
                />
                <button
                  onClick={handleAddMember}
                  disabled={submitting || !newMemberEmail.trim()}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    backgroundColor: '#FF8A80',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting || !newMemberEmail.trim() ? 'not-allowed' : 'pointer',
                    opacity: submitting || !newMemberEmail.trim() ? 0.6 : 1,
                  }}
                >
                  {submitting ? '추가 중...' : '추가'}
                </button>
              </div>
              <p style={{ fontSize: '14px', color: '#757575', marginTop: '8px' }}>
                💡 추가할 사용자는 먼저 구글 계정으로 로그인해야 합니다. 이메일 주소를 입력해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
