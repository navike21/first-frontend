import { request } from '@/shared/api'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import type { UserGroup } from '../model/user.types'

export const userGroupsApi = {
  list: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    query.set('limit', String(params.limit ?? 100))
    if (params.page) query.set('page', String(params.page))
    return request<ApiResponse<PaginatedData<UserGroup>>>({
      api: `/user-groups?${query.toString()}`,
      method: 'GET',
    })
  },
}
