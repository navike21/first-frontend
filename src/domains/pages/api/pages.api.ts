import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type {
  BuilderSection,
  Page,
  PageListParams,
  PageRevision,
} from '../model/page.types'
import type { CreatePagePayload } from '../model/page.schema'

const BASE = '/pages'

type BulkResult = {
  processedIds: string[]
  notFoundIds: string[]
  blockedIds?: string[]
}

export interface PageImageFiles {
  cover?: File | null
  ogImage?: File | null
}

export const pagesApi = {
  listAdmin: (params: PageListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.status) query.set('status', params.status)
    if (params.parentId) query.set('parentId', params.parentId)
    const qs = query.toString()
    return request<ApiResponse<Page[]>>({
      api: qs ? `${BASE}/admin?${qs}` : `${BASE}/admin`,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Page>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (
    body: CreatePagePayload,
    files?: PageImageFiles,
    coverLibraryUrl?: string
  ) => {
    const payloadBody = {
      ...body,
      ...(!files?.cover && coverLibraryUrl
        ? { coverImageUrl: coverLibraryUrl }
        : {}),
    }
    if ((files?.cover || files?.ogImage) && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(payloadBody))
      if (files.cover) fd.append('cover', files.cover)
      if (files.ogImage) fd.append('ogImage', files.ogImage)
      return request<ApiResponse<Page>, FormData>({
        api: BASE,
        method: 'POST',
        body: fd,
      })
    }
    return request<ApiResponse<Page>, typeof payloadBody>({
      api: BASE,
      method: 'POST',
      body: payloadBody,
    })
  },

  update: (
    id: string,
    body: Partial<CreatePagePayload>,
    files?: PageImageFiles,
    removeCover?: boolean,
    coverLibraryUrl?: string
  ) => {
    let coverOverride: { coverImageUrl: string } | undefined
    if (removeCover) coverOverride = { coverImageUrl: '' }
    else if (!files?.cover && coverLibraryUrl)
      coverOverride = { coverImageUrl: coverLibraryUrl }
    const payloadBody = { ...body, ...coverOverride }
    if ((files?.cover || files?.ogImage) && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(payloadBody))
      if (files.cover) fd.append('cover', files.cover)
      if (files.ogImage) fd.append('ogImage', files.ogImage)
      return request<ApiResponse<Page>, FormData>({
        api: `${BASE}/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    return request<ApiResponse<Page>, typeof payloadBody>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body: payloadBody,
    })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Page>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Page[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Page>>({
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

  replaceSections: (id: string, sections: BuilderSection[]) =>
    request<ApiResponse<Page>, { sections: BuilderSection[] }>({
      api: `${BASE}/${id}/sections`,
      method: 'PUT',
      body: { sections },
    }),

  listRevisions: (id: string) =>
    request<ApiResponse<PageRevision[]>>({
      api: `${BASE}/${id}/revisions`,
      method: 'GET',
    }),

  restoreRevision: (id: string, revisionId: string) =>
    request<ApiResponse<Page>>({
      api: `${BASE}/${id}/revisions/${revisionId}/restore`,
      method: 'POST',
    }),
}
