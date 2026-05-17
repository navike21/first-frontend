export type UserGender = 'female' | 'male' | 'other' | 'prefer_not_to_say'
export type UserStatus = 'active' | 'inactive' | 'deleted'
export type PresenceStatus = 'available' | 'busy' | 'away' | 'offline'

export interface UserMetadata {
  genders: UserGender[]
  presenceStatuses: PresenceStatus[]
  userStatuses: Exclude<UserStatus, 'deleted'>[]
}

export interface UserGroup {
  id: string
  name: string
  description?: string
  color: string
  status: 'active' | 'inactive'
}

export interface UserAddress {
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: UserGender
  phone?: string
  profilePictureUrl?: string
  address?: UserAddress
  groupId?: string
  isEmailVerified: boolean
  status: UserStatus
  presenceStatus: PresenceStatus
  lastSeenAt?: string
  createdAt: string
  updatedAt: string
}

export interface UserListParams {
  page?: number
  limit?: number
  status?: 'active' | 'inactive'
  search?: string
  groupId?: string
}
