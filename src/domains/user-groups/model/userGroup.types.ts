export type UserGroupStatus = 'active' | 'inactive'

export interface UserGroup {
  id: string
  name: string
  slug: string
  description?: string
  permissions: string[]
  color: string
  isSystem: boolean
  status: UserGroupStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface UserGroupListParams {
  page?: number
  limit?: number
  status?: UserGroupStatus
  search?: string
}
