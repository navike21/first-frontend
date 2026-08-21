import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { ordersApi } from './orders.api'
import type { OrderListParams, OrderStatus, PaymentStatus } from '../model/order.types'
import type { CreateOrderPayload } from '../model/order.schema'

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrderListParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  trash: () => [...orderKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...orderKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useOrders = (params: OrderListParams = {}) =>
  useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.list(params),
    placeholderData: keepPreviousData,
  })

export const useOrder = (id: string) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useOrdersTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: orderKeys.trashList(params),
    queryFn: () => ordersApi.trash(params),
    placeholderData: keepPreviousData,
  })

// ─── Cross-domain pickers ───────────────────────────────────────────────────
// Local, read-only wrappers around other domains' admin endpoints (same
// pattern already established by `coupons`' product/category pickers) —
// this domain doesn't depend on customers/products/inventory/ecommerce-
// settings exporting a query hook.

export interface OrderCustomerPickerItem {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const useCustomersForOrderPicker = () =>
  useQuery({
    queryKey: ['customers', 'picker-for-orders'],
    queryFn: () =>
      request<ApiResponse<OrderCustomerPickerItem[]>>({
        api: '/customers?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 60 * 1000,
  })

// Single-item lookups for the order detail page — the order only stores
// `customerId`/`fulfillmentLocationId`, never a name snapshot.
export const useCustomerForOrder = (customerId: string) =>
  useQuery({
    queryKey: ['customers', 'detail-for-orders', customerId],
    queryFn: () =>
      request<ApiResponse<OrderCustomerPickerItem>>({
        api: `/customers/${customerId}`,
        method: 'GET',
      }),
    select: (res) => res.data,
    enabled: !!customerId,
    staleTime: 60 * 1000,
  })

export interface OrderLocationPickerItem {
  id: string
  name: string
  isActive: boolean
}

export const useLocationsForOrderPicker = () =>
  useQuery({
    queryKey: ['locations', 'picker-for-orders'],
    queryFn: () =>
      request<ApiResponse<OrderLocationPickerItem[]>>({
        api: '/inventory/locations?limit=100&isActive=true',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 60 * 1000,
  })

export const useLocationForOrder = (locationId: string) =>
  useQuery({
    queryKey: ['locations', 'detail-for-orders', locationId],
    queryFn: () =>
      request<ApiResponse<OrderLocationPickerItem>>({
        api: `/inventory/locations/${locationId}`,
        method: 'GET',
      }),
    select: (res) => res.data,
    enabled: !!locationId,
    staleTime: 60 * 1000,
  })

export interface OrderProductPickerVariant {
  id: string
  sku?: string
  optionValues: Record<string, string>
  price: { amount: number; currency: string }
}

export interface OrderProductPickerItem {
  id: string
  name: Record<string, string>
  sku?: string
  price: { amount: number; currency: string }
  hasVariants: boolean
  variants: OrderProductPickerVariant[]
}

export const useProductsForOrderPicker = () =>
  useQuery({
    queryKey: ['products', 'picker-for-orders'],
    queryFn: () =>
      request<ApiResponse<OrderProductPickerItem[]>>({
        api: '/products/admin?limit=100&isActive=true',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 60 * 1000,
  })

interface EcommerceSettingsPickerData {
  currency: string
}

export const useCurrencyForOrderPicker = () =>
  useQuery({
    queryKey: ['ecommerce-settings', 'picker-for-orders'],
    queryFn: () =>
      request<ApiResponse<EcommerceSettingsPickerData>>({
        api: '/ecommerce-settings',
        method: 'GET',
      }),
    select: (res) => res.data?.currency ?? 'USD',
    staleTime: 5 * 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.lists() }),
  })
}

export const useUpdateOrderStatus = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      status,
      trackingNumber,
    }: {
      status: OrderStatus
      trackingNumber?: string
    }) => ordersApi.updateStatus(id, status, trackingNumber),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.lists() })
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) })
    },
  })
}

export const useUpdateOrderPaymentStatus = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (paymentStatus: PaymentStatus) =>
      ordersApi.updatePaymentStatus(id, paymentStatus),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.lists() })
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) })
    },
  })
}

export const useSoftDeleteOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.lists() })
      qc.invalidateQueries({ queryKey: orderKeys.trash() })
    },
  })
}

export const useRestoreOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.trash() })
      qc.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

export const usePurgeOrder = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.trash() }),
  })
}

export const useBulkSoftDeleteOrders = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => ordersApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.lists() })
      qc.invalidateQueries({ queryKey: orderKeys.trash() })
    },
  })
}

export const useBulkRestoreOrders = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => ordersApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.trash() })
      qc.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}

export const useBulkPurgeOrders = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => ordersApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.trash() }),
  })
}
