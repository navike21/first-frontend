import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Service, ServiceListParams } from '../model/service.types'
import type { CreateServicePayload } from '../model/service.schema'

const BASE = '/services'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const servicesApi = {
  list: (params: ServiceListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return request<ApiResponse<Service[]>>({
      api: qs ? `${BASE}/admin?${qs}` : `${BASE}/admin`,
      method: 'GET',
    })
  },

  getBySlug: (slug: string) =>
    request<ApiResponse<Service>>({ api: `${BASE}/${slug}`, method: 'GET' }),

  getById: (id: string) =>
    request<ApiResponse<Service>>({ api: `${BASE}/id/${id}`, method: 'GET' }),

  create: (body: CreateServicePayload, cover?: File | null, iconFile?: File | null) => {
    if ((cover || iconFile) && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      if (cover) fd.append('cover', cover)
      if (iconFile) fd.append('icon', iconFile)
      return request<ApiResponse<Service>, FormData>({
        api: BASE,
        method: 'POST',
        body: fd,
      })
    }
    return request<ApiResponse<Service>, CreateServicePayload>({
      api: BASE,
      method: 'POST',
      body,
    })
  },

  update: (
    id: string,
    body: Partial<CreateServicePayload>,
    cover?: File | null,
    iconFile?: File | null,
    removeCover?: boolean,
    removeIcon?: boolean
  ) => {
    if ((cover || iconFile) && navigator.onLine) {
      const fd = new FormData()
      const payloadBody = removeCover ? { ...body, coverImageUrl: '' } : body
      const finalBody = removeIcon ? { ...payloadBody, icon: '' } : payloadBody
      fd.append('data', JSON.stringify(finalBody))
      if (cover) fd.append('cover', cover)
      if (iconFile) fd.append('icon', iconFile)
      return request<ApiResponse<Service>, FormData>({
        api: `${BASE}/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    let payload: Partial<CreateServicePayload> = body
    if (removeCover) payload = { ...payload, coverImageUrl: '' }
    if (removeIcon) payload = { ...payload, icon: '' }
    return request<ApiResponse<Service>, typeof payload>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body: payload,
    })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Service>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Service[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Service>>({
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
