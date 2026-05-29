import { request } from '@/shared/api'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import type { UserGroup, UserGroupListParams } from '../model/userGroup.types'
import type { CreateUserGroupFormData, UpdateUserGroupFormData } from '../model/userGroup.schema'

const BASE = '/user-groups'

export const userGroupsApi = {
  list: (params: UserGroupListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return request<ApiResponse<PaginatedData<UserGroup>>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<UserGroup>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateUserGroupFormData) =>
    request<ApiResponse<UserGroup>, CreateUserGroupFormData>({
      api: BASE,
      method: 'POST',
      body,
    }),

  update: (id: string, body: UpdateUserGroupFormData) =>
    request<ApiResponse<UserGroup>, UpdateUserGroupFormData>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body,
    }),

  softDelete: (id: string) =>
    request<ApiResponse<UserGroup>>({ api: `${BASE}/${id}/soft`, method: 'DELETE' }),

  permissionsCatalog: () =>
    request<ApiResponse<string[]>>({ api: '/permissions/catalog', method: 'GET' }),
}
