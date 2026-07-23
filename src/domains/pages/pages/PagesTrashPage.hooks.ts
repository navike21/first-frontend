import { useState } from 'react'
import { HttpError } from '@/shared/api'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  usePagesTrash,
  useRestorePage,
  usePurgePage,
  useBulkRestorePages,
  useBulkPurgePages,
} from '../api/pages.queries'
import { usePagesTranslation } from '../i18n'
import type { Page, PagePaginationMeta } from '../model/page.types'

export function usePagesTrashPage() {
  const { t, language } = usePagesTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Page | null>(null)
  const [restoring, setRestoring] = useState<Page | null>(null)
  const [purging, setPurging] = useState<Page | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = usePagesTrash({ page, limit: 20 })
  const restore = useRestorePage()
  const purge = usePurgePage()
  const bulkRestore = useBulkRestorePages()
  const bulkPurge = useBulkPurgePages()

  const items = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as PagePaginationMeta | undefined
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
      onError: (error) => {
        if (error instanceof HttpError && error.code === 'PAGE_HAS_CHILDREN') {
          notify.error(t.actions.purgeBlockedByChildren)
          setPurging(null)
          return
        }
        onQueuedOr(() => setPurging(null))(error)
      },
    })
  }

  const handleConfirmBulk = () => {
    if (bulkAction === 'restore') {
      bulkRestore.mutate(selectedIds, {
        onSuccess: () => {
          notify.success(t.toasts.bulkRestored)
          clearSelection()
          setBulkAction(null)
        },
        onError: onQueuedOr(() => {
          clearSelection()
          setBulkAction(null)
        }),
      })
      return
    }
    bulkPurge.mutate(selectedIds, {
      onSuccess: (res) => {
        const blockedIds = res.data.blockedIds ?? []
        if (blockedIds.length > 0) {
          notify.error(t.actions.purgeBlockedByChildren)
        } else {
          notify.success(t.toasts.bulkPurged)
        }
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
