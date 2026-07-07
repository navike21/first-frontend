import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Portfolio, PortfolioListParams } from '../model/portfolio.types'
import type { CreatePortfolioPayload } from '../model/portfolio.schema'

const BASE = '/portfolio'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const portfolioApi = {
  listAdmin: (params: PortfolioListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    const qs = query.toString()
    return request<ApiResponse<Portfolio[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getBySlug: (slug: string) =>
    request<ApiResponse<Portfolio>>({ api: `${BASE}/${slug}`, method: 'GET' }),

  create: (body: CreatePortfolioPayload, cover?: File | null) => {
    if (cover && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('cover', cover)
      return request<ApiResponse<Portfolio>, FormData>({ api: BASE, method: 'POST', body: fd })
    }
    return request<ApiResponse<Portfolio>, CreatePortfolioPayload>({ api: BASE, method: 'POST', body })
  },

  update: (
    id: string,
    body: Partial<CreatePortfolioPayload>,
    cover?: File | null,
    removeCover?: boolean,
  ) => {
    if (cover && navigator.onLine) {
      const fd = new FormData()
      const payloadBody = removeCover ? { ...body, coverImageUrl: '' } : body
      fd.append('data', JSON.stringify(payloadBody))
      fd.append('cover', cover)
      return request<ApiResponse<Portfolio>, FormData>({ api: `${BASE}/${id}`, method: 'PATCH', body: fd })
    }
    const payload = removeCover ? { ...body, coverImageUrl: '' } : body
    return request<ApiResponse<Portfolio>, typeof payload>({ api: `${BASE}/${id}`, method: 'PATCH', body: payload })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Portfolio>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Portfolio[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Portfolio>>({ api: `${BASE}/${id}/restore`, method: 'PATCH' }),

  purge: (id: string) =>
    request<ApiResponse<null>>({ api: `${BASE}/${id}/permanent`, method: 'DELETE' }),

  bulkSoftDelete: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({ api: `${BASE}/bulk`, method: 'DELETE', body: { ids } }),

  bulkRestore: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({ api: `${BASE}/bulk/restore`, method: 'PATCH', body: { ids } }),

  bulkPurge: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({ api: `${BASE}/bulk/permanent`, method: 'DELETE', body: { ids } }),
}
