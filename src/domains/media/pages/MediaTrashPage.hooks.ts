import { useEffect, useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useStorageTrash,
  useRestoreStorageFile,
  usePurgeStorageFiles,
  useBulkRestoreStorageFiles,
} from '@/shared/api/storage.queries'
import type { StorageFile, StorageListParams } from '@/shared/api/storage'
import { useMediaTranslation } from '../i18n'

const SEARCH_DEBOUNCE_MS = 300

export function useMediaTrashPage() {
  const { t } = useMediaTranslation()
  const [params, setParams] = useState<StorageListParams>({
    page: 1,
    limit: 20,
  })
  const [searchInput, setSearchInput] = useState('')
  const [viewing, setViewing] = useState<StorageFile | null>(null)
  const [restoring, setRestoring] = useState<StorageFile | null>(null)
  const [purging, setPurging] = useState<StorageFile | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = useStorageTrash(params)
  const restore = useRestoreStorageFile()
  const purge = usePurgeStorageFiles()
  const bulkRestore = useBulkRestoreStorageFiles()
  const bulkPurge = usePurgeStorageFiles()

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((p) => ({ ...p, page: 1, search: searchInput || undefined }))
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchInput])

  const items = data?.items ?? []
  const meta = data?.meta
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleKindChange = (value: string) => {
    setParams((p) => ({
      ...p,
      page: 1,
      kind: value === 'all' ? undefined : (value as 'image' | 'video'),
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

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
    purge.mutate([purging.id], {
      onSuccess: () => {
        notify.success(t.toasts.purged)
        setPurging(null)
      },
      onError: onQueuedOr(() => setPurging(null)),
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
      onSuccess: () => {
        notify.success(t.toasts.bulkPurged)
        clearSelection()
        setBulkAction(null)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkAction(null)
      }),
    })
  }

  const kindOptions = [
    { value: 'all', label: t.filters.kindAll },
    { value: 'image', label: t.filters.kindImage },
    { value: 'video', label: t.filters.kindVideo },
  ]

  return {
    t,
    params,
    searchInput,
    setSearchInput,
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
    kindOptions,
    setViewing,
    setRestoring,
    setPurging,
    setSelectedIds,
    setBulkAction,
    clearSelection,
    handleKindChange,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulk,
    handlePageChange,
  }
}
