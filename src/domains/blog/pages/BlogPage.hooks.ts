import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  usePostList,
  useSoftDeletePost,
  useBulkSoftDeletePosts,
} from '../api/blog.queries'
import { useBlogTranslation } from '../i18n'
import type { Post, BlogListParams, BlogPaginationMeta } from '../model/blog.types'

export function useBlogPage() {
  const navigate = useNavigate()
  const { t, language } = useBlogTranslation()
  const [params, setParams] = useState<BlogListParams>({ page: 1, limit: 20 })
  const [deletingItem, setDeletingItem] = useState<Post | null>(null)
  const [viewingItem, setViewingItem] = useState<Post | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = usePostList(params)
  const softDelete = useSoftDeletePost()
  const bulkSoftDelete = useBulkSoftDeletePosts()

  const items = data?.data ?? []
  const meta = data?.meta as BlogPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (item: Post) => setViewingItem(item)
  const handleEdit = (item: Post) =>
    navigate({ to: navPaths.blogEdit(item.id, language) as never })
  const handleDelete = (item: Post) => setDeletingItem(item)

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
      status: value === 'all' ? undefined : (value as BlogListParams['status']),
    }))
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
    params,
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
