import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useOrdersTrash,
  useRestoreOrder,
  usePurgeOrder,
  useBulkRestoreOrders,
  useBulkPurgeOrders,
} from '../api/orders.queries'
import { useOrdersTranslation } from '../i18n'
import type { Order, OrderPaginationMeta } from '../model/order.types'

export function useOrdersTrashPage() {
  const { t, language } = useOrdersTranslation()
  const [page, setPage] = useState(1)
  const [restoring, setRestoring] = useState<Order | null>(null)
  const [purging, setPurging] = useState<Order | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = useOrdersTrash({ page, limit: 20 })
  const restore = useRestoreOrder()
  const purge = usePurgeOrder()
  const bulkRestore = useBulkRestoreOrders()
  const bulkPurge = useBulkPurgeOrders()

  const orders = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as OrderPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleConfirmRestore = () => {
    if (!restoring) return
    restore.mutate(restoring.id, {
      onSuccess: () => {
        notify.success(t.toasts.restored)
        setRestoring(null)
      },
      onError: onQueuedOr(() => setRestoring(null)),
    })
  }

  const handleConfirmPurge = () => {
    if (!purging) return
    purge.mutate(purging.id, {
      onSuccess: () => {
        notify.success(t.toasts.purged)
        setPurging(null)
      },
      onError: onQueuedOr(() => setPurging(null)),
    })
  }

  const handleConfirmBulk = () => {
    const mutation = bulkAction === 'restore' ? bulkRestore : bulkPurge
    const toast = bulkAction === 'restore' ? t.toasts.bulkRestored : t.toasts.bulkPurged
    mutation.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(toast)
        clearSelection()
        setBulkAction(null)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkAction(null)
      }),
    })
  }

  const handlePageChange = (next: number) => {
    setPage(next)
    clearSelection()
  }

  return {
    t,
    language,
    orders,
    total,
    pages,
    page,
    isLoading,
    isFetching,
    restoring,
    purging,
    selectedIds,
    bulkAction,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    setRestoring,
    setPurging,
    setSelectedIds,
    setBulkAction,
    clearSelection,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulk,
    handlePageChange,
  }
}
