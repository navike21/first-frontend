import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { ProductReview, ProductReviewListParams } from '../model/productReview.types'

const BASE = '/product-reviews'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const productReviewsApi = {
  list: (params: ProductReviewListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.status) query.set('status', params.status)
    const qs = query.toString()
    return request<ApiResponse<ProductReview[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  approve: (id: string) =>
    request<ApiResponse<ProductReview>>({ api: `${BASE}/${id}/approve`, method: 'PATCH' }),

  reject: (id: string) =>
    request<ApiResponse<ProductReview>>({ api: `${BASE}/${id}/reject`, method: 'PATCH' }),

  softDelete: (id: string) =>
    request<ApiResponse<ProductReview>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<ProductReview[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<ProductReview>>({ api: `${BASE}/${id}/restore`, method: 'PATCH' }),

  purge: (id: string) =>
    request<ApiResponse<null>>({ api: `${BASE}/${id}/permanent`, method: 'DELETE' }),

  bulkSoftDelete: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk`,
      method: 'DELETE',
      body: { ids },
    }),

  bulkRestore: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk/restore`,
      method: 'PATCH',
      body: { ids },
    }),

  bulkPurge: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk/permanent`,
      method: 'DELETE',
      body: { ids },
    }),
}
