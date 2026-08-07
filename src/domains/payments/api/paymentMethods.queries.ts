import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { paymentMethodsApi } from './paymentMethods.api'
import type { PaymentMethodListParams } from '../model/payment.types'
import type { CreatePaymentMethodPayload } from '../model/paymentMethod.schema'

export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: (params: PaymentMethodListParams) =>
    [...paymentMethodKeys.lists(), params] as const,
  details: () => [...paymentMethodKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentMethodKeys.details(), id] as const,
  trash: () => [...paymentMethodKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...paymentMethodKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const usePaymentMethods = (params: PaymentMethodListParams = {}) =>
  useQuery({
    queryKey: paymentMethodKeys.list(params),
    queryFn: () => paymentMethodsApi.list(params),
    placeholderData: keepPreviousData,
  })

export const usePaymentMethod = (id: string) =>
  useQuery({
    queryKey: paymentMethodKeys.detail(id),
    queryFn: () => paymentMethodsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const usePaymentMethodsTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: paymentMethodKeys.trashList(params),
    queryFn: () => paymentMethodsApi.trash(params),
    placeholderData: keepPreviousData,
  })

// Local, read-only wrapper around `customers` — same cross-domain pattern
// `products`/`coupons` use for their own pickers. First consumer needing a
// customer picker.
interface CustomerPickerItem {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const useCustomersForPaymentPicker = () =>
  useQuery({
    queryKey: ['customers', 'picker-for-payments'],
    queryFn: () =>
      request<ApiResponse<CustomerPickerItem[]>>({
        api: '/customers?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreatePaymentMethod = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentMethodPayload) => paymentMethodsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentMethodKeys.lists() }),
  })
}

export const useUpdatePaymentMethod = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreatePaymentMethodPayload>) =>
      paymentMethodsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.lists() })
      qc.invalidateQueries({ queryKey: paymentMethodKeys.detail(id) })
    },
  })
}

export const useSoftDeletePaymentMethod = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.lists() })
      qc.invalidateQueries({ queryKey: paymentMethodKeys.trash() })
    },
  })
}

export const useRestorePaymentMethod = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.trash() })
      qc.invalidateQueries({ queryKey: paymentMethodKeys.lists() })
    },
  })
}

export const usePurgePaymentMethod = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentMethodsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentMethodKeys.trash() }),
  })
}

export const useBulkSoftDeletePaymentMethods = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => paymentMethodsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.lists() })
      qc.invalidateQueries({ queryKey: paymentMethodKeys.trash() })
    },
  })
}

export const useBulkRestorePaymentMethods = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => paymentMethodsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentMethodKeys.trash() })
      qc.invalidateQueries({ queryKey: paymentMethodKeys.lists() })
    },
  })
}

export const useBulkPurgePaymentMethods = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => paymentMethodsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentMethodKeys.trash() }),
  })
}
