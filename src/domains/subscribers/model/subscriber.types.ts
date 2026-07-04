export type SubscriberStatus = 'active' | 'inactive'
export type SubscriberGender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export interface SubscriberContactInfo {
  email: string
  phoneNumber?: string
  address?: string
}

export interface SubscriberPersonalInfo {
  gender: SubscriberGender
  dateOfBirth?: string
  profilePictureUrl?: string
}

export interface Subscriber {
  id: string
  firstName: string
  lastName: string
  contactInformation: SubscriberContactInfo
  personalInformation: SubscriberPersonalInfo
  status: SubscriberStatus
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface SubscriberListParams {
  page?: number
  limit?: number
  status?: SubscriberStatus
  search?: string
}

export interface SubscriberPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
