import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import { usePages, useSoftDeletePage, useBulkSoftDeletePages } from '../api/pages.queries'
import { usePagesTranslation } from '../i18n'
import type { Page, PageListParams, PagePaginationMeta } from '../model/page.types'

export function usePagesPage() {
  const navigate = useNavigate()
  const { t, language } = usePagesTranslation()
  const [params, setParams] = useState<PageListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingItem, setDeletingItem] = useState<Page | null>(null)
  const [viewingItem, setViewingItem] = useState<Page | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading } = usePages({ ...params, search: search || undefined })
  const softDelete = useSoftDeletePage()
  const bulkSoftDelete = useBulkSoftDeletePages()

  const items = data?.data ?? []
  const meta = data?.meta as PagePaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (item: Page) => setViewingItem(item)
  const handleEdit = (item: Page) => navigate({ to: navPaths.pageEdit(item.id, language) as never })
  const handleBuild = (item: Page) => navigate({ to: navPaths.pageBuilder(item.id, language) as never })
  const handleDelete = (item: Page) => setDeletingItem(item)

  const handleConfirmDelete = () => {
    if (!deletingItem) return
    softDelete.mutate(deletingItem.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingItem(null)
      },
      onError: onQueuedOr(() => setDeletingItem(null)),
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
    setParams((p) => ({ ...p, page: 1, status: value === 'all' ? undefined : (value as Page['status']) }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'draft', label: t.status.draft },
    { value: 'scheduled', label: t.status.scheduled },
    { value: 'published', label: t.status.published },
  ]

  return {
    t,
    language,
    search,
    params,
    items,
    total,
    page,
    pages,
    isLoading,
    deletingItem,
    viewingItem,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleView,
    handleEdit,
    handleBuild,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingItem,
    setViewingItem,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
