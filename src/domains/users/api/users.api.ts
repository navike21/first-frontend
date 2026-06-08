import { request } from '@/shared/api'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import type { User, UserListParams, UserMetadata } from '../model/user.types'
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from '../model/user.schema'

const BASE = '/users'

export const usersApi = {
  metadata: () =>
    request<ApiResponse<UserMetadata>>({
      api: `${BASE}/metadata`,
      method: 'GET',
    }),

  list: (params: UserListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    if (params.groupId) query.set('groupId', params.groupId)
    const qs = query.toString()
    return request<ApiResponse<PaginatedData<User>>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<User>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateUserFormData) =>
    request<
      ApiResponse<Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>>,
      CreateUserFormData
    >({
      api: BASE,
      method: 'POST',
      body,
    }),

  update: (id: string, body: UpdateUserFormData) =>
    request<ApiResponse<User>, UpdateUserFormData>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body,
    }),

  softDelete: (id: string) =>
    request<ApiResponse<User>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  hardDelete: (id: string) =>
    request<ApiResponse<null>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<PaginatedData<User>>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<User>>({
      api: `${BASE}/${id}/restore`,
      method: 'PATCH',
    }),

  purge: (id: string) =>
    request<ApiResponse<User>>({
      api: `${BASE}/${id}/permanent`,
      method: 'DELETE',
    }),

  bulkSoftDelete: (ids: string[]) =>
    request<
      ApiResponse<{ processedIds: string[]; notFoundIds: string[] }>,
      { ids: string[] }
    >({
      api: `${BASE}/bulk`,
      method: 'DELETE',
      body: { ids },
    }),

  bulkRestore: (ids: string[]) =>
    request<
      ApiResponse<{ processedIds: string[]; notFoundIds: string[] }>,
      { ids: string[] }
    >({
      api: `${BASE}/bulk/restore`,
      method: 'PATCH',
      body: { ids },
    }),

  bulkPurge: (ids: string[]) =>
    request<
      ApiResponse<{ processedIds: string[]; notFoundIds: string[] }>,
      { ids: string[] }
    >({
      api: `${BASE}/bulk/permanent`,
      method: 'DELETE',
      body: { ids },
    }),
}
