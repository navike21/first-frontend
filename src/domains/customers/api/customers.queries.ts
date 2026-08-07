import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { customersApi } from './customers.api'
import type { CustomerListParams } from '../model/customer.types'
import type { CreateCustomerPayload } from '../model/customer.schema'

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomerListParams) =>
    [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  trash: () => [...customerKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...customerKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useCustomers = (params: CustomerListParams = {}) =>
  useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customersApi.list(params),
    placeholderData: keepPreviousData,
  })

export const useCustomer = (id: string) =>
  useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customersApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useCustomersTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: customerKeys.trashList(params),
    queryFn: () => customersApi.trash(params),
    placeholderData: keepPreviousData,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateCustomer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCustomerPayload) => customersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: customerKeys.lists() }),
  })
}

export const useUpdateCustomer = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateCustomerPayload>) =>
      customersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.detail(id) })
    },
  })
}

export const useSoftDeleteCustomer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customersApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.trash() })
    },
  })
}

export const useRestoreCustomer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customersApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.trash() })
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

export const usePurgeCustomer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customersApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: customerKeys.trash() }),
  })
}

export const useBulkSoftDeleteCustomers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => customersApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.trash() })
    },
  })
}

export const useBulkRestoreCustomers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => customersApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.trash() })
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })
}

export const useBulkPurgeCustomers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => customersApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: customerKeys.trash() }),
  })
}
