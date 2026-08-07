import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { couponsApi } from './coupons.api'
import type { CouponListParams } from '../model/coupon.types'
import type { CreateCouponPayload } from '../model/coupon.schema'

export const couponKeys = {
  all: ['coupons'] as const,
  lists: () => [...couponKeys.all, 'list'] as const,
  list: (params: CouponListParams) => [...couponKeys.lists(), params] as const,
  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (id: string) => [...couponKeys.details(), id] as const,
  trash: () => [...couponKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...couponKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useCoupons = (params: CouponListParams = {}) =>
  useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => couponsApi.list(params),
    placeholderData: keepPreviousData,
  })

export const useCoupon = (id: string) =>
  useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => couponsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useCouponsTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: couponKeys.trashList(params),
    queryFn: () => couponsApi.trash(params),
    placeholderData: keepPreviousData,
  })

// ─── Cross-domain pickers ───────────────────────────────────────────────────
// Local, read-only wrappers around other domains' admin endpoints (same
// pattern as `products`' own picker hooks) — this domain doesn't depend on
// products/product-categories/ecommerce-settings exporting a query hook.

interface ProductPickerItem {
  id: string
  name: Record<string, string>
}

export const useProductsForCouponPicker = () =>
  useQuery({
    queryKey: ['products', 'picker-for-coupons'],
    queryFn: () =>
      request<ApiResponse<ProductPickerItem[]>>({
        api: '/products/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

interface CategoryPickerItem {
  id: string
  name: Record<string, string>
}

export const useProductCategoriesForCouponPicker = () =>
  useQuery({
    queryKey: ['product-categories', 'picker-for-coupons'],
    queryFn: () =>
      request<ApiResponse<CategoryPickerItem[]>>({
        api: '/product-categories/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

interface EcommerceSettingsPickerData {
  currency: string
}

export const useCurrencyForCouponPicker = () =>
  useQuery({
    queryKey: ['ecommerce-settings', 'picker-for-coupons'],
    queryFn: () =>
      request<ApiResponse<EcommerceSettingsPickerData>>({
        api: '/ecommerce-settings',
        method: 'GET',
      }),
    select: (res) => res.data?.currency ?? 'USD',
    staleTime: 5 * 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCouponPayload) => couponsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: couponKeys.lists() }),
  })
}

export const useUpdateCoupon = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateCouponPayload>) =>
      couponsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.lists() })
      qc.invalidateQueries({ queryKey: couponKeys.detail(id) })
    },
  })
}

export const useSoftDeleteCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => couponsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.lists() })
      qc.invalidateQueries({ queryKey: couponKeys.trash() })
    },
  })
}

export const useRestoreCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => couponsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.trash() })
      qc.invalidateQueries({ queryKey: couponKeys.lists() })
    },
  })
}

export const usePurgeCoupon = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => couponsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: couponKeys.trash() }),
  })
}

export const useBulkSoftDeleteCoupons = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => couponsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.lists() })
      qc.invalidateQueries({ queryKey: couponKeys.trash() })
    },
  })
}

export const useBulkRestoreCoupons = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => couponsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.trash() })
      qc.invalidateQueries({ queryKey: couponKeys.lists() })
    },
  })
}

export const useBulkPurgeCoupons = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => couponsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: couponKeys.trash() }),
  })
}
