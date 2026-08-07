import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { shippingRulesApi } from './shippingRules.api'
import type { ShippingRuleListParams } from '../model/shippingRule.types'
import type { CreateShippingRulePayload } from '../model/shippingRule.schema'

export const shippingRuleKeys = {
  all: ['shipping-rules'] as const,
  lists: () => [...shippingRuleKeys.all, 'list'] as const,
  list: (params: ShippingRuleListParams) =>
    [...shippingRuleKeys.lists(), params] as const,
  details: () => [...shippingRuleKeys.all, 'detail'] as const,
  detail: (id: string) => [...shippingRuleKeys.details(), id] as const,
  trash: () => [...shippingRuleKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...shippingRuleKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useShippingRules = (params: ShippingRuleListParams = {}) =>
  useQuery({
    queryKey: shippingRuleKeys.list(params),
    queryFn: () => shippingRulesApi.list(params),
    placeholderData: keepPreviousData,
  })

export const useShippingRule = (id: string) =>
  useQuery({
    queryKey: shippingRuleKeys.detail(id),
    queryFn: () => shippingRulesApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useShippingRulesTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: shippingRuleKeys.trashList(params),
    queryFn: () => shippingRulesApi.trash(params),
    placeholderData: keepPreviousData,
  })

// Local, read-only wrapper around `ecommerce-settings` — same cross-domain
// pattern `products`/`coupons` use for their own currency picker.
interface EcommerceSettingsPickerData {
  currency: string
}

export const useCurrencyForShippingPicker = () =>
  useQuery({
    queryKey: ['ecommerce-settings', 'picker-for-shipping'],
    queryFn: () =>
      request<ApiResponse<EcommerceSettingsPickerData>>({
        api: '/ecommerce-settings',
        method: 'GET',
      }),
    select: (res) => res.data?.currency ?? 'USD',
    staleTime: 5 * 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateShippingRule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateShippingRulePayload) => shippingRulesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingRuleKeys.lists() }),
  })
}

export const useUpdateShippingRule = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateShippingRulePayload>) =>
      shippingRulesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingRuleKeys.lists() })
      qc.invalidateQueries({ queryKey: shippingRuleKeys.detail(id) })
    },
  })
}

export const useSoftDeleteShippingRule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => shippingRulesApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingRuleKeys.lists() })
      qc.invalidateQueries({ queryKey: shippingRuleKeys.trash() })
    },
  })
}

export const useRestoreShippingRule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => shippingRulesApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingRuleKeys.trash() })
      qc.invalidateQueries({ queryKey: shippingRuleKeys.lists() })
    },
  })
}

export const usePurgeShippingRule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => shippingRulesApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingRuleKeys.trash() }),
  })
}

export const useBulkSoftDeleteShippingRules = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => shippingRulesApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingRuleKeys.lists() })
      qc.invalidateQueries({ queryKey: shippingRuleKeys.trash() })
    },
  })
}

export const useBulkRestoreShippingRules = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => shippingRulesApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingRuleKeys.trash() })
      qc.invalidateQueries({ queryKey: shippingRuleKeys.lists() })
    },
  })
}

export const useBulkPurgeShippingRules = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => shippingRulesApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingRuleKeys.trash() }),
  })
}
