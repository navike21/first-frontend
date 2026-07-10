import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useTagsTrash,
  useRestoreTag,
  usePurgeTag,
  useBulkRestoreTags,
  useBulkPurgeTags,
} from '../api/tags.queries'
import { useTagsTranslation } from '../i18n'
import type { Tag, TagPaginationMeta } from '../model/tag.types'

export function useTagsTrashPage() {
  const { t, language } = useTagsTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Tag | null>(null)
  const [restoring, setRestoring] = useState<Tag | null>(null)
  const [purging, setPurging] = useState<Tag | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading } = useTagsTrash({ page, limit: 20 })
  const restore = useRestoreTag()
  const purge = usePurgeTag()
  const bulkRestore = useBulkRestoreTags()
  const bulkPurge = useBulkPurgeTags()

  const tags = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as TagPaginationMeta | undefined
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
    tags,
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
