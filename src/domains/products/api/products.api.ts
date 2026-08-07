import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Product, ProductListParams } from '../model/product.types'
import type {
  CreateProductPayload,
  GalleryOrderToken,
} from '../model/product.schema'

const BASE = '/products'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const productsApi = {
  listAdmin: (params: ProductListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.status) query.set('status', params.status)
    if (params.categoryId) query.set('categoryId', params.categoryId)
    if (params.tagId) query.set('tagId', params.tagId)
    const qs = query.toString()
    return request<ApiResponse<Product[]>>({
      api: qs ? `${BASE}/admin?${qs}` : `${BASE}/admin`,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Product>>({ api: `${BASE}/id/${id}`, method: 'GET' }),

  create: (body: CreateProductPayload, galleryFiles?: File[]) => {
    if (galleryFiles?.length && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      galleryFiles.forEach((file) => fd.append('gallery', file))
      return request<ApiResponse<Product>, FormData>({
        api: BASE,
        method: 'POST',
        body: fd,
      })
    }
    return request<ApiResponse<Product>, CreateProductPayload>({
      api: BASE,
      method: 'POST',
      body,
    })
  },

  update: (
    id: string,
    body: Partial<CreateProductPayload>,
    galleryFiles?: File[],
    galleryOrder?: GalleryOrderToken[]
  ) => {
    const payloadBody = {
      ...body,
      ...(galleryOrder ? { galleryOrder } : {}),
    }
    if (galleryFiles?.length && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(payloadBody))
      galleryFiles.forEach((file) => fd.append('gallery', file))
      return request<ApiResponse<Product>, FormData>({
        api: `${BASE}/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    return request<ApiResponse<Product>, typeof payloadBody>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body: payloadBody,
    })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Product>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Product[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Product>>({
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
