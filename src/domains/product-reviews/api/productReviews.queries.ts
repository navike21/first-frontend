import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { productReviewsApi } from './productReviews.api'
import type { ProductReviewListParams } from '../model/productReview.types'

export const productReviewKeys = {
  all: ['product-reviews'] as const,
  lists: () => [...productReviewKeys.all, 'list'] as const,
  list: (params: ProductReviewListParams) => [...productReviewKeys.lists(), params] as const,
  trash: () => [...productReviewKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...productReviewKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useProductReviews = (params: ProductReviewListParams = {}) =>
  useQuery({
    queryKey: productReviewKeys.list(params),
    queryFn: () => productReviewsApi.list(params),
    placeholderData: keepPreviousData,
  })

export const useProductReviewsTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: productReviewKeys.trashList(params),
    queryFn: () => productReviewsApi.trash(params),
    placeholderData: keepPreviousData,
  })

// ─── Cross-domain pickers ───────────────────────────────────────────────────
// Local, read-only wrappers to resolve productId/customerId into display
// names for the moderation table and detail modal — same pattern already
// established by coupons/orders' local picker hooks.

export interface ProductReviewProductPickerItem {
  id: string
  name: Record<string, string>
}

export const useProductsForReviewPicker = () =>
  useQuery({
    queryKey: ['products', 'picker-for-reviews'],
    queryFn: () =>
      request<ApiResponse<ProductReviewProductPickerItem[]>>({
        api: '/products/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 60 * 1000,
  })

export interface ProductReviewCustomerPickerItem {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const useCustomersForReviewPicker = () =>
  useQuery({
    queryKey: ['customers', 'picker-for-reviews'],
    queryFn: () =>
      request<ApiResponse<ProductReviewCustomerPickerItem[]>>({
        api: '/customers?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useApproveProductReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productReviewsApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productReviewKeys.lists() }),
  })
}

export const useRejectProductReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productReviewsApi.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productReviewKeys.lists() }),
  })
}

export const useSoftDeleteProductReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productReviewsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productReviewKeys.lists() })
      qc.invalidateQueries({ queryKey: productReviewKeys.trash() })
    },
  })
}

export const useRestoreProductReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productReviewsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productReviewKeys.trash() })
      qc.invalidateQueries({ queryKey: productReviewKeys.lists() })
    },
  })
}

export const usePurgeProductReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productReviewsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productReviewKeys.trash() }),
  })
}

export const useBulkSoftDeleteProductReviews = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productReviewsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productReviewKeys.lists() })
      qc.invalidateQueries({ queryKey: productReviewKeys.trash() })
    },
  })
}

export const useBulkRestoreProductReviews = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productReviewsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productReviewKeys.trash() })
      qc.invalidateQueries({ queryKey: productReviewKeys.lists() })
    },
  })
}

export const useBulkPurgeProductReviews = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productReviewsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: productReviewKeys.trash() }),
  })
}
