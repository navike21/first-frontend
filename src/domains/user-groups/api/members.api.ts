import { request } from '@/shared/api'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import type {
  AddMembersResult,
  GroupMember,
  GroupMemberListParams,
} from '../model/userGroup.types'

const BASE = '/user-groups'

function buildQuery(params: GroupMemberListParams): string {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.status) query.set('status', params.status)
  if (params.search) query.set('search', params.search)
  return query.toString()
}

export const membersApi = {
  list: (groupId: string, params: GroupMemberListParams = {}) => {
    const qs = buildQuery(params)
    return request<ApiResponse<PaginatedData<GroupMember>>>({
      api: qs ? `${BASE}/${groupId}/members?${qs}` : `${BASE}/${groupId}/members`,
      method: 'GET',
    })
  },

  add: (groupId: string, userIds: string[]) =>
    request<ApiResponse<AddMembersResult>, { userIds: string[] }>({
      api: `${BASE}/${groupId}/members`,
      method: 'POST',
      body: { userIds },
    }),

  remove: (groupId: string, userId: string) =>
    request<ApiResponse<{ groupId: string; userId: string }>>({
      api: `${BASE}/${groupId}/members/${userId}`,
      method: 'DELETE',
    }),

  /** Searches users to add as members (active users, by name/email). */
  searchUsers: (params: { search?: string; limit?: number } = {}) => {
    const query = new URLSearchParams()
    query.set('limit', String(params.limit ?? 10))
    query.set('status', 'active')
    if (params.search) query.set('search', params.search)
    return request<ApiResponse<PaginatedData<GroupMember>>>({
      api: `/users?${query.toString()}`,
      method: 'GET',
    })
  },
}
