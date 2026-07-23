import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Service, ServiceListParams } from '../model/service.types'
import type { CreateServicePayload } from '../model/service.schema'

const BASE = '/services'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

interface UpdateOverrides {
  removeCover?: boolean
  removeIcon?: boolean
  hasCoverFile: boolean
  hasIconFile: boolean
  coverLibraryUrl?: string
  iconLibraryUrl?: string
}

// Shared by the multipart `data` part and the plain-JSON body: "remove" wins
// over a library pick, and a library pick only applies when no new file for
// that same asset is being uploaded in this same request.
function withCoverIconOverrides<T extends Partial<CreateServicePayload>>(
  body: T,
  {
    removeCover,
    removeIcon,
    hasCoverFile,
    hasIconFile,
    coverLibraryUrl,
    iconLibraryUrl,
  }: UpdateOverrides
): T {
  let next = body
  if (removeCover) next = { ...next, coverImageUrl: '' }
  else if (!hasCoverFile && coverLibraryUrl)
    next = { ...next, coverImageUrl: coverLibraryUrl }
  if (removeIcon) next = { ...next, icon: '' }
  else if (!hasIconFile && iconLibraryUrl)
    next = { ...next, icon: iconLibraryUrl }
  return next
}

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

  create: (
    body: CreateServicePayload,
    cover?: File | null,
    iconFile?: File | null,
    coverLibraryUrl?: string,
    iconLibraryUrl?: string
  ) => {
    if ((cover || iconFile) && navigator.onLine) {
      const fd = new FormData()
      let dataBody = body
      if (!cover && coverLibraryUrl)
        dataBody = { ...dataBody, coverImageUrl: coverLibraryUrl }
      if (!iconFile && iconLibraryUrl)
        dataBody = { ...dataBody, icon: iconLibraryUrl }
      fd.append('data', JSON.stringify(dataBody))
      if (cover) fd.append('cover', cover)
      if (iconFile) fd.append('icon', iconFile)
      return request<ApiResponse<Service>, FormData>({
        api: BASE,
        method: 'POST',
        body: fd,
      })
    }
    let payload = body
    if (coverLibraryUrl)
      payload = { ...payload, coverImageUrl: coverLibraryUrl }
    if (iconLibraryUrl) payload = { ...payload, icon: iconLibraryUrl }
    return request<ApiResponse<Service>, typeof payload>({
      api: BASE,
      method: 'POST',
      body: payload,
    })
  },

  update: (
    id: string,
    body: Partial<CreateServicePayload>,
    cover?: File | null,
    iconFile?: File | null,
    removeCover?: boolean,
    removeIcon?: boolean,
    coverLibraryUrl?: string,
    iconLibraryUrl?: string
  ) => {
    const overrides = {
      removeCover,
      removeIcon,
      coverLibraryUrl,
      iconLibraryUrl,
    }
    if ((cover || iconFile) && navigator.onLine) {
      const fd = new FormData()
      const dataBody = withCoverIconOverrides(body, {
        ...overrides,
        hasCoverFile: !!cover,
        hasIconFile: !!iconFile,
      })
      fd.append('data', JSON.stringify(dataBody))
      if (cover) fd.append('cover', cover)
      if (iconFile) fd.append('icon', iconFile)
      return request<ApiResponse<Service>, FormData>({
        api: `${BASE}/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    const payload = withCoverIconOverrides(body, {
      ...overrides,
      hasCoverFile: false,
      hasIconFile: false,
    })
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
