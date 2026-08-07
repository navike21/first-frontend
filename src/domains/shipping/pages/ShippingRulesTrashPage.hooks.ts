import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useShippingRulesTrash,
  useRestoreShippingRule,
  usePurgeShippingRule,
  useBulkRestoreShippingRules,
  useBulkPurgeShippingRules,
} from '../api/shippingRules.queries'
import { useShippingTranslation } from '../i18n'
import type { ShippingRule, ShippingRulePaginationMeta } from '../model/shippingRule.types'

export function useShippingRulesTrashPage() {
  const { t, language } = useShippingTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<ShippingRule | null>(null)
  const [restoring, setRestoring] = useState<ShippingRule | null>(null)
  const [purging, setPurging] = useState<ShippingRule | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = useShippingRulesTrash({ page, limit: 20 })
  const restore = useRestoreShippingRule()
  const purge = usePurgeShippingRule()
  const bulkRestore = useBulkRestoreShippingRules()
  const bulkPurge = useBulkPurgeShippingRules()

  const rules = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as ShippingRulePaginationMeta | undefined
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
    rules,
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
