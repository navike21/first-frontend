import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Coupon, CouponListParams } from '../model/coupon.types'
import type { CreateCouponPayload } from '../model/coupon.schema'

const BASE = '/coupons'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const couponsApi = {
  list: (params: CouponListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.status) query.set('status', params.status)
    const qs = query.toString()
    return request<ApiResponse<Coupon[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Coupon>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateCouponPayload) =>
    request<ApiResponse<Coupon>, CreateCouponPayload>({
      api: BASE,
      method: 'POST',
      body,
    }),

  update: (id: string, body: Partial<CreateCouponPayload>) =>
    request<ApiResponse<Coupon>, typeof body>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body,
    }),

  softDelete: (id: string) =>
    request<ApiResponse<Coupon>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Coupon[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Coupon>>({
      api: `${BASE}/${id}/restore`,
      method: 'PATCH',
    }),

  purge: (id: string) =>
    request<ApiResponse<null>>({
      api: `${BASE}/${id}/permanent`,
      method: 'DELETE',
    }),

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
