import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Collaborator, CollaboratorListParams } from '../model/collaborator.types'
import type { CreateCollaboratorPayload } from '../model/collaborator.schema'

const BASE = '/collaborators'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const collaboratorsApi = {
  listAdmin: (params: CollaboratorListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.isActive !== undefined) query.set('isActive', String(params.isActive))
    const qs = query.toString()
    return request<ApiResponse<Collaborator[]>>({
      api: qs ? `${BASE}/admin?${qs}` : `${BASE}/admin`,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Collaborator>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateCollaboratorPayload, photo?: File | null) => {
    if (photo && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('photo', photo)
      return request<ApiResponse<Collaborator>, FormData>({ api: BASE, method: 'POST', body: fd })
    }
    return request<ApiResponse<Collaborator>, CreateCollaboratorPayload>({ api: BASE, method: 'POST', body })
  },

  update: (id: string, body: Partial<CreateCollaboratorPayload>, photo?: File | null) => {
    if (photo && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('photo', photo)
      return request<ApiResponse<Collaborator>, FormData>({ api: `${BASE}/${id}`, method: 'PATCH', body: fd })
    }
    return request<ApiResponse<Collaborator>, typeof body>({ api: `${BASE}/${id}`, method: 'PATCH', body })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Collaborator>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Collaborator[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Collaborator>>({ api: `${BASE}/${id}/restore`, method: 'PATCH' }),

  purge: (id: string) =>
    request<ApiResponse<null>>({ api: `${BASE}/${id}/permanent`, method: 'DELETE' }),

  bulkSoftDelete: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({ api: `${BASE}/bulk`, method: 'DELETE', body: { ids } }),

  bulkRestore: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({ api: `${BASE}/bulk/restore`, method: 'PATCH', body: { ids } }),

  bulkPurge: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({ api: `${BASE}/bulk/permanent`, method: 'DELETE', body: { ids } }),
}
