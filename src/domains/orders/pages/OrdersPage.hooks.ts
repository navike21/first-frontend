import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import { useOrders, useSoftDeleteOrder, useBulkSoftDeleteOrders } from '../api/orders.queries'
import { useOrdersTranslation } from '../i18n'
import type { Order, OrderListParams, OrderPaginationMeta } from '../model/order.types'

function valueFor(value: string | undefined): string {
  return value ?? 'all'
}

export function useOrdersPage() {
  const navigate = useNavigate()
  const { t, language } = useOrdersTranslation()
  const [params, setParams] = useState<OrderListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useOrders({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteOrder()
  const bulkSoftDelete = useBulkSoftDeleteOrders()

  const orders = data?.data ?? []
  const meta = data?.meta as OrderPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (order: Order) =>
    navigate({ to: navPaths.orderDetail(order.id, language) as never })
  const handleDelete = (order: Order) => setDeletingOrder(order)

  const handleConfirmDelete = () => {
    if (!deletingOrder) return
    softDelete.mutate(deletingOrder.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingOrder(null)
      },
      onError: onQueuedOr(() => setDeletingOrder(null)),
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
      status: value === 'all' ? undefined : (value as OrderListParams['status']),
    }))
    clearSelection()
  }

  const handlePaymentStatusChange = (value: string) => {
    setParams((p) => ({
      ...p,
      page: 1,
      paymentStatus: value === 'all' ? undefined : (value as OrderListParams['paymentStatus']),
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'pending', label: t.status.pending },
    { value: 'confirmed', label: t.status.confirmed },
    { value: 'processing', label: t.status.processing },
    { value: 'shipped', label: t.status.shipped },
    { value: 'delivered', label: t.status.delivered },
    { value: 'cancelled', label: t.status.cancelled },
    { value: 'refunded', label: t.status.refunded },
  ]

  const paymentStatusOptions = [
    { value: 'all', label: t.filters.paymentStatusAll },
    { value: 'unpaid', label: t.paymentStatus.unpaid },
    { value: 'partially_paid', label: t.paymentStatus.partially_paid },
    { value: 'paid', label: t.paymentStatus.paid },
    { value: 'refunded', label: t.paymentStatus.refunded },
  ]

  const statusValue = valueFor(params.status)
  const paymentStatusValue = valueFor(params.paymentStatus)

  return {
    t,
    language,
    search,
    statusValue,
    paymentStatusValue,
    orders,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingOrder,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    paymentStatusOptions,
    handleView,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePaymentStatusChange,
    handlePageChange,
    setDeletingOrder,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
