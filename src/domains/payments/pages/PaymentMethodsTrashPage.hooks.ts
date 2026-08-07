import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  usePaymentMethodsTrash,
  useRestorePaymentMethod,
  usePurgePaymentMethod,
  useBulkRestorePaymentMethods,
  useBulkPurgePaymentMethods,
} from '../api/paymentMethods.queries'
import { usePaymentsTranslation } from '../i18n'
import type { PaymentMethod, PaymentMethodPaginationMeta } from '../model/payment.types'

export function usePaymentMethodsTrashPage() {
  const { t, language } = usePaymentsTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<PaymentMethod | null>(null)
  const [restoring, setRestoring] = useState<PaymentMethod | null>(null)
  const [purging, setPurging] = useState<PaymentMethod | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = usePaymentMethodsTrash({ page, limit: 20 })
  const restore = useRestorePaymentMethod()
  const purge = usePurgePaymentMethod()
  const bulkRestore = useBulkRestorePaymentMethods()
  const bulkPurge = useBulkPurgePaymentMethods()

  const methods = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as PaymentMethodPaginationMeta | undefined
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
    methods,
    total,
    pages,
    page,
    isLoading,
    isFetching,
    viewing,
    restoring,
    purging,
    selectedIds,
    bulkAction,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    setViewing,
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
