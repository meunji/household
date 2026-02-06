/**
 * API 서비스 레이어
 * 각 도메인별 API 호출 함수들을 정의
 * Android 앱에서도 동일한 구조로 구현 가능
 */

import { API_ENDPOINTS } from './endpoints'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

// 자산 관련 API
export const assetService = {
  /**
   * 자산 목록 조회
   * @returns {Promise<Array>}
   */
  getAssets: async () => {
    return apiGet(API_ENDPOINTS.ASSETS.LIST)
  },
  
  /**
   * 자산 생성
   * @param {Object} data - { type: 'CASH' | 'LOAN', name: string, amount: number }
   * @returns {Promise<Object>}
   */
  createAsset: async (data) => {
    return apiPost(API_ENDPOINTS.ASSETS.CREATE, data)
  },
  
  /**
   * 자산 수정
   * @param {string} id - 자산 ID
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>}
   */
  updateAsset: async (id, data) => {
    return apiPut(API_ENDPOINTS.ASSETS.UPDATE(id), data)
  },
  
  /**
   * 자산 삭제
   * @param {string} id - 자산 ID
   * @returns {Promise<void>}
   */
  deleteAsset: async (id) => {
    return apiDelete(API_ENDPOINTS.ASSETS.DELETE(id))
  },
}

// 거래 관련 API
export const transactionService = {
  /**
   * 거래 목록 조회
   * @param {Object} params - { type?: 'INCOME' | 'EXPENSE', start_date?: string, end_date?: string }
   * @returns {Promise<Array>}
   */
  getTransactions: async (params = {}) => {
    return apiGet(API_ENDPOINTS.TRANSACTIONS.LIST, params)
  },
  
  /**
   * 거래 생성
   * @param {Object} data - { type: 'INCOME' | 'EXPENSE', amount: number, category: string, date: string, memo?: string }
   * @returns {Promise<Object>}
   */
  createTransaction: async (data) => {
    return apiPost(API_ENDPOINTS.TRANSACTIONS.CREATE, data)
  },
  
  /**
   * 거래 수정
   * @param {string} id - 거래 ID
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>}
   */
  updateTransaction: async (id, data) => {
    return apiPut(API_ENDPOINTS.TRANSACTIONS.UPDATE(id), data)
  },
  
  /**
   * 거래 삭제
   * @param {string} id - 거래 ID
   * @returns {Promise<void>}
   */
  deleteTransaction: async (id) => {
    return apiDelete(API_ENDPOINTS.TRANSACTIONS.DELETE(id))
  },
}

// 계산 관련 API
export const calculationService = {
  /**
   * 전체 요약 조회 (총 자산, 총 부채, 순자산)
   * @returns {Promise<Object>} - { total_assets, total_liabilities, net_worth }
   */
  getSummary: async () => {
    return apiGet(API_ENDPOINTS.CALCULATIONS.SUMMARY)
  },
  
  /**
   * 월별 수입/지출 합계
   * @param {Object} params - { year?: number, month?: number }
   * @returns {Promise<Object>} - { total_income, total_expense, month, year }
   */
  getMonthlySummary: async (params = {}) => {
    return apiGet(API_ENDPOINTS.CALCULATIONS.MONTHLY, params)
  },
}

// 카테고리 관련 API
export const categoryService = {
  /**
   * 거래 유형별 카테고리 목록 조회
   * @param {string} type - 'INCOME' 또는 'EXPENSE'
   * @returns {Promise<Array>}
   */
  getCategories: async (type) => {
    return apiGet(API_ENDPOINTS.CATEGORIES.LIST, { type })
  },
  
  /**
   * 모든 카테고리 조회
   * @returns {Promise<Array>}
   */
  getAllCategories: async () => {
    return apiGet(API_ENDPOINTS.CATEGORIES.ALL)
  },
}
