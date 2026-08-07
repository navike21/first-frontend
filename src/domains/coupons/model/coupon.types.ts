export interface Money {
  amount: number
  currency: string
}

export type CouponType = 'percentage' | 'fixed'
export type CouponScopeType = 'cart' | 'products' | 'categories'
export type CouponStatus = 'active' | 'inactive'

export interface CouponScope {
  type: CouponScopeType
  targetIds: string[]
}

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  maxDiscountAmount?: Money
  usageLimitTotal?: number
  usageLimitPerCustomer?: number
  timesUsed: number
  startsAt?: string
  expiresAt?: string
  isStackable: boolean
  scope: CouponScope
  status: CouponStatus
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface CouponListParams {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export interface CouponPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
