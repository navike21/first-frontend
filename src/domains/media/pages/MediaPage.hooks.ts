import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { useStorageFiles, useSoftDeleteStorageFiles, storageKeys } from '@/shared/api/storage.queries'
import type { StorageFile, StorageListParams } from '@/shared/api/storage'
import { useMediaTranslation } from '../i18n'

const SEARCH_DEBOUNCE_MS = 300

export function useMediaPage() {
  const qc = useQueryClient()
  const { t } = useMediaTranslation()
  const [params, setParams] = useState<StorageListParams>({ page: 1, limit: 20 })
  const [searchInput, setSearchInput] = useState('')
  const [deletingItem, setDeletingItem] = useState<StorageFile | null>(null)
  const [viewingItem, setViewingItem] = useState<StorageFile | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const { data, isLoading, isFetching } = useStorageFiles(params)
  const softDelete = useSoftDeleteStorageFiles()

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

  const handleView = (item: StorageFile) => setViewingItem(item)
  const handleDelete = (item: StorageFile) => setDeletingItem(item)

  const handleConfirmDelete = () => {
    if (!deletingItem) return
    softDelete.mutate([deletingItem.id], {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingItem(null)
      },
      onError: onQueuedOr(() => setDeletingItem(null)),
    })
  }

  const handleConfirmBulkDelete = () => {
    softDelete.mutate(selectedIds, {
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

  const handleKindChange = (value: string) => {
    setParams((p) => ({ ...p, page: 1, kind: value === 'all' ? undefined : (value as 'image' | 'video') }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const handleUploaded = () => {
    qc.invalidateQueries({ queryKey: storageKeys.all })
    notify.success(t.toasts.uploaded)
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
    page,
    pages,
    isLoading,
    isFetching,
    deletingItem,
    viewingItem,
    selectedIds,
    bulkConfirmOpen,
    uploadOpen,
    softDelete,
    kindOptions,
    handleView,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleKindChange,
    handlePageChange,
    handleUploaded,
    setDeletingItem,
    setViewingItem,
    setSelectedIds,
    setBulkConfirmOpen,
    setUploadOpen,
    clearSelection,
  }
}
