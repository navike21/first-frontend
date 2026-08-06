import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Post, BlogListParams } from '../model/blog.types'
import type { CreateBlogPostPayload } from '../model/blog.schema'

const BASE = '/blog'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export interface BlogImageFiles {
  cover?: File | null
  ogImage?: File | null
}

export const blogApi = {
  listAdmin: (params: BlogListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    if (params.categoryId) query.set('categoryId', params.categoryId)
    if (params.tagId) query.set('tagId', params.tagId)
    const qs = query.toString()
    return request<ApiResponse<Post[]>>({
      api: qs ? `${BASE}/admin?${qs}` : `${BASE}/admin`,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Post>>({ api: `${BASE}/id/${id}`, method: 'GET' }),

  create: (
    body: CreateBlogPostPayload,
    files?: BlogImageFiles,
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
      return request<ApiResponse<Post>, FormData>({
        api: BASE,
        method: 'POST',
        body: fd,
      })
    }
    return request<ApiResponse<Post>, typeof payloadBody>({
      api: BASE,
      method: 'POST',
      body: payloadBody,
    })
  },

  update: (
    id: string,
    body: Partial<CreateBlogPostPayload>,
    files?: BlogImageFiles,
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
      return request<ApiResponse<Post>, FormData>({
        api: `${BASE}/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    return request<ApiResponse<Post>, typeof payloadBody>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body: payloadBody,
    })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Post>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Post[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Post>>({
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
