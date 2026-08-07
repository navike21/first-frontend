import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useCustomers,
  useSoftDeleteCustomer,
  useBulkSoftDeleteCustomers,
} from '../api/customers.queries'
import { useCustomersTranslation } from '../i18n'
import type {
  Customer,
  CustomerListParams,
  CustomerPaginationMeta,
} from '../model/customer.types'

function statusValueFor(
  status: 'active' | 'inactive' | undefined
): 'all' | 'active' | 'inactive' {
  return status ?? 'all'
}

export function useCustomersPage() {
  const navigate = useNavigate()
  const { t, language } = useCustomersTranslation()
  const [params, setParams] = useState<CustomerListParams>({
    page: 1,
    limit: 20,
  })
  const [search, setSearch] = useState('')
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  )
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useCustomers({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteCustomer()
  const bulkSoftDelete = useBulkSoftDeleteCustomers()

  const customers = data?.data ?? []
  const meta = data?.meta as CustomerPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (customer: Customer) => setViewingCustomer(customer)
  const handleEdit = (customer: Customer) =>
    navigate({ to: navPaths.customerEdit(customer.id, language) as never })
  const handleDelete = (customer: Customer) => setDeletingCustomer(customer)

  const handleConfirmDelete = () => {
    if (!deletingCustomer) return
    softDelete.mutate(deletingCustomer.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingCustomer(null)
      },
      onError: onQueuedOr(() => setDeletingCustomer(null)),
    })
  }

  const handleConfirmBulkDelete = () => {
    bulkSoftDelete.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(t.toasts.bulkDeleted)
        clearSelection()
        setBulkConfirmOpen(false)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkConfirmOpen(false)
      }),
    })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setParams((p) => ({ ...p, page: 1 }))
    clearSelection()
  }

  const handleStatusChange = (value: string) => {
    setParams((p) => ({
      ...p,
      page: 1,
      status: value === 'all' ? undefined : (value as 'active' | 'inactive'),
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'active', label: t.filters.statusActive },
    { value: 'inactive', label: t.filters.statusInactive },
  ]

  const statusValue = statusValueFor(params.status)

  return {
    t,
    language,
    search,
    statusValue,
    customers,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingCustomer,
    viewingCustomer,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingCustomer,
    setViewingCustomer,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
