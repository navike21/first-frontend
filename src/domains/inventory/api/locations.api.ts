import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Location, LocationListParams } from '../model/location.types'
import type { CreateLocationPayload } from '../model/location.schema'

const BASE = '/inventory/locations'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const locationsApi = {
  list: (params: LocationListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.isActive !== undefined)
      query.set('isActive', String(params.isActive))
    const qs = query.toString()
    return request<ApiResponse<Location[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Location>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateLocationPayload) =>
    request<ApiResponse<Location>, CreateLocationPayload>({
      api: BASE,
      method: 'POST',
      body,
    }),

  update: (id: string, body: Partial<CreateLocationPayload>) =>
    request<ApiResponse<Location>, typeof body>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body,
    }),

  softDelete: (id: string) =>
    request<ApiResponse<Location>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Location[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Location>>({
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
