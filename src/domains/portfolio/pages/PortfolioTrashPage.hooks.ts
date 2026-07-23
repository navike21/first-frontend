import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  usePortfolioTrash,
  useRestorePortfolio,
  usePurgePortfolio,
  useBulkRestorePortfolio,
  useBulkPurgePortfolio,
} from '../api/portfolio.queries'
import { usePortfolioTranslation } from '../i18n'
import type {
  Portfolio,
  PortfolioPaginationMeta,
} from '../model/portfolio.types'

export function usePortfolioTrashPage() {
  const { t, language } = usePortfolioTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Portfolio | null>(null)
  const [restoring, setRestoring] = useState<Portfolio | null>(null)
  const [purging, setPurging] = useState<Portfolio | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = usePortfolioTrash({ page, limit: 20 })
  const restore = useRestorePortfolio()
  const purge = usePurgePortfolio()
  const bulkRestore = useBulkRestorePortfolio()
  const bulkPurge = useBulkPurgePortfolio()

  const items = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as PortfolioPaginationMeta | undefined
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
    const toastMsg =
      bulkAction === 'restore' ? t.toasts.bulkRestored : t.toasts.bulkPurged
    mutation.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(toastMsg)
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
    items,
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
