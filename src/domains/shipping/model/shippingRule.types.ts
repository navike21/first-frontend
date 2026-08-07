export interface Money {
  amount: number
  currency: string
}

export type ShippingRuleType = 'flat' | 'free_over_threshold' | 'by_zone'

export interface ShippingZone {
  region: string
  provinces?: string[]
}

export interface ShippingRule {
  id: string
  name: string
  type: ShippingRuleType
  amount: Money
  freeOverAmount?: Money
  zones: ShippingZone[]
  isActive: boolean
  order: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface ShippingRuleListParams {
  page?: number
  limit?: number
  isActive?: boolean
  search?: string
}

export interface ShippingRulePaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
