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

/** A user shown as a member of a group (subset of the User entity). */
export interface GroupMember {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePictureUrl?: string
  status: 'active' | 'inactive'
}

export interface GroupMemberListParams {
  page?: number
  limit?: number
  status?: 'active' | 'inactive'
  search?: string
}

export interface AddMembersResult {
  groupId: string
  addedIds: string[]
  notFoundIds: string[]
}
