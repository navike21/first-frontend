import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useCategoriesTrash,
  useRestoreCategory,
  usePurgeCategory,
  useBulkRestoreCategories,
  useBulkPurgeCategories,
} from '../api/categories.queries'
import { useCategoriesTranslation } from '../i18n'
import type { Category, CategoryPaginationMeta } from '../model/category.types'

export function useCategoriesTrashPage() {
  const { t, language } = useCategoriesTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Category | null>(null)
  const [restoring, setRestoring] = useState<Category | null>(null)
  const [purging, setPurging] = useState<Category | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading } = useCategoriesTrash({ page, limit: 20 })
  const restore = useRestoreCategory()
  const purge = usePurgeCategory()
  const bulkRestore = useBulkRestoreCategories()
  const bulkPurge = useBulkPurgeCategories()

  const categories = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as CategoryPaginationMeta | undefined
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
    const toast =
      bulkAction === 'restore' ? t.toasts.bulkRestored : t.toasts.bulkPurged
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
    categories,
    total,
    pages,
    page,
    isLoading,
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
