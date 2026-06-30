import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Client, ClientListParams } from '../model/client.types'
import type {
  CreateClientFormData,
  UpdateClientFormData,
} from '../model/client.schema'

const BASE = '/clients'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const clientsApi = {
  list: (params: ClientListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return request<ApiResponse<Client[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Client>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateClientFormData, logo?: File | null) => {
    // Multipart can't be serialised into the offline queue, so offline we send
    // JSON without the logo (it gets queued); online with a logo uses multipart.
    if (logo && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('logo', logo)
      return request<ApiResponse<Client>, FormData>({
        api: BASE,
        method: 'POST',
        body: fd,
      })
    }
    return request<ApiResponse<Client>, CreateClientFormData>({
      api: BASE,
      method: 'POST',
      body,
    })
  },

  update: (
    id: string,
    body: UpdateClientFormData,
    logo?: File | null,
    removeLogo?: boolean
  ) => {
    if (logo && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('logo', logo)
      return request<ApiResponse<Client>, FormData>({
        api: `${BASE}/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    // Empty logoUrl tells the backend to clear the existing logo.
    const payload = removeLogo ? { ...body, logoUrl: '' } : body
    return request<ApiResponse<Client>, typeof payload>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body: payload,
    })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Client>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Client[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Client>>({
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
