import { apiRequest, apiGet, apiPost, apiPut, apiDelete } from './client'
import { API_ENDPOINTS } from './endpoints'

/**
 * 자산 관련 API 서비스
 */
export const assetService = {
  getAssets: () => apiGet(API_ENDPOINTS.ASSETS.LIST),
  getAsset: (id) => apiGet(API_ENDPOINTS.ASSETS.GET(id)),
  createAsset: (data) => apiPost(API_ENDPOINTS.ASSETS.CREATE, data),
  updateAsset: (id, data) => apiPut(API_ENDPOINTS.ASSETS.UPDATE(id), data),
  deleteAsset: (id) => apiDelete(API_ENDPOINTS.ASSETS.DELETE(id)),
}

/**
 * 거래 관련 API 서비스
 */
export const transactionService = {
  getTransactions: () => apiGet(API_ENDPOINTS.TRANSACTIONS.LIST),
  getTransaction: (id) => apiGet(API_ENDPOINTS.TRANSACTIONS.GET(id)),
  createTransaction: (data) => apiPost(API_ENDPOINTS.TRANSACTIONS.CREATE, data),
  updateTransaction: (id, data) => apiPut(API_ENDPOINTS.TRANSACTIONS.UPDATE(id), data),
  deleteTransaction: (id) => apiDelete(API_ENDPOINTS.TRANSACTIONS.DELETE(id)),
}

/**
 * 계산 관련 API 서비스
 */
export const calculationService = {
  getSummary: () => apiGet(API_ENDPOINTS.CALCULATIONS.SUMMARY),
  getMonthlySummary: (year, month) => {
    const url = new URL(API_ENDPOINTS.CALCULATIONS.MONTHLY)
    if (year) url.searchParams.set('year', year)
    if (month) url.searchParams.set('month', month)
    return apiGet(url.toString())
  },
}

/**
 * 카테고리 관련 API 서비스
 */
export const categoryService = {
  getCategories: (type) => {
    const url = new URL(API_ENDPOINTS.CATEGORIES.LIST)
    if (type) {
      url.searchParams.set('type', type)
    }
    return apiGet(url.toString())
  },
  // apiGet(API_ENDPOINTS.CATEGORIES.LIST),
  getAllCategories: () => apiGet(API_ENDPOINTS.CATEGORIES.ALL),
}

/**
 * 가족 그룹 관련 API 서비스
 */
export const familyService = {
  createFamilyGroup: (data) => apiPost(API_ENDPOINTS.FAMILY.GROUPS.CREATE, data),
  getMyFamilyGroup: () => apiGet(API_ENDPOINTS.FAMILY.GROUPS.MY),
  addFamilyMember: (familyGroupId, data) => 
    apiPost(API_ENDPOINTS.FAMILY.GROUPS.ADD_MEMBER(familyGroupId), data),
  removeFamilyMember: (familyGroupId, memberUserId) => 
    apiDelete(API_ENDPOINTS.FAMILY.GROUPS.REMOVE_MEMBER(familyGroupId, memberUserId)),
}
