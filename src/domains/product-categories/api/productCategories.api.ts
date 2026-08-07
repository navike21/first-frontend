import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type {
  ProductCategory,
  ProductCategoryListParams,
} from '../model/productCategory.types'
import type { CreateProductCategoryPayload } from '../model/productCategory.schema'

const BASE = '/product-categories'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const productCategoriesApi = {
  listAdmin: (params: ProductCategoryListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.isActive !== undefined)
      query.set('isActive', String(params.isActive))
    if (params.parentId) query.set('parentId', params.parentId)
    const qs = query.toString()
    return request<ApiResponse<ProductCategory[]>>({
      api: qs ? `${BASE}/admin?${qs}` : `${BASE}/admin`,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<ProductCategory>>({
      api: `${BASE}/${id}`,
      method: 'GET',
    }),

  create: (body: CreateProductCategoryPayload) =>
    request<ApiResponse<ProductCategory>, CreateProductCategoryPayload>({
      api: BASE,
      method: 'POST',
      body,
    }),

  update: (id: string, body: Partial<CreateProductCategoryPayload>) =>
    request<ApiResponse<ProductCategory>, typeof body>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body,
    }),

  softDelete: (id: string) =>
    request<ApiResponse<ProductCategory>>({
      api: `${BASE}/${id}`,
      method: 'DELETE',
    }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<ProductCategory[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<ProductCategory>>({
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
