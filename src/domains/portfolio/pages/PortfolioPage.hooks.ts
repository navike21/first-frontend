import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  usePortfolioList,
  useSoftDeletePortfolio,
  useBulkSoftDeletePortfolio,
} from '../api/portfolio.queries'
import { usePortfolioTranslation } from '../i18n'
import type { Portfolio, PortfolioListParams, PortfolioPaginationMeta } from '../model/portfolio.types'

export function usePortfolioPage() {
  const navigate = useNavigate()
  const { t, language } = usePortfolioTranslation()
  const [params, setParams] = useState<PortfolioListParams>({ page: 1, limit: 20 })
  const [deletingItem, setDeletingItem] = useState<Portfolio | null>(null)
  const [viewingItem, setViewingItem] = useState<Portfolio | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading } = usePortfolioList(params)
  const softDelete = useSoftDeletePortfolio()
  const bulkSoftDelete = useBulkSoftDeletePortfolio()

  const items = data?.data ?? []
  const meta = data?.meta as PortfolioPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (item: Portfolio) => setViewingItem(item)
  const handleEdit = (item: Portfolio) =>
    navigate({ to: navPaths.portfolioEdit(item.slug, language) as never })
  const handleDelete = (item: Portfolio) => setDeletingItem(item)

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

  const handleStatusChange = (value: string) => {
    setParams((p) => ({
      ...p,
      page: 1,
      status: value === 'all' ? undefined : (value as PortfolioListParams['status']),
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'draft', label: t.filters.statusDraft },
    { value: 'published', label: t.filters.statusPublished },
    { value: 'archived', label: t.filters.statusArchived },
  ]

  return {
    t,
    language,
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
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleStatusChange,
    handlePageChange,
    setDeletingItem,
    setViewingItem,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
