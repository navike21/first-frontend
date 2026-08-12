export const PRODUCT_REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const
export type ProductReviewStatus = (typeof PRODUCT_REVIEW_STATUSES)[number]

export interface ProductReview {
  id: string
  productId: string
  customerId?: string | null
  guestName?: string
  guestEmail?: string
  rating: number
  title?: string
  comment: string
  status: ProductReviewStatus
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface ProductReviewListParams {
  page?: number
  limit?: number
  status?: ProductReviewStatus
  search?: string
}

export interface ProductReviewPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
