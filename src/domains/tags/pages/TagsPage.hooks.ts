import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useTags,
  useSoftDeleteTag,
  useBulkSoftDeleteTags,
} from '../api/tags.queries'
import { useTagsTranslation } from '../i18n'
import type { Tag, TagListParams, TagPaginationMeta } from '../model/tag.types'

function statusValueFor(
  isActive: boolean | undefined
): 'all' | 'active' | 'inactive' {
  if (isActive === undefined) return 'all'
  return isActive ? 'active' : 'inactive'
}

export function useTagsPage() {
  const navigate = useNavigate()
  const { t, language } = useTagsTranslation()
  const [params, setParams] = useState<TagListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
  const [viewingTag, setViewingTag] = useState<Tag | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useTags({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteTag()
  const bulkSoftDelete = useBulkSoftDeleteTags()

  const tags = data?.data ?? []
  const meta = data?.meta as TagPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (tag: Tag) => setViewingTag(tag)
  const handleEdit = (tag: Tag) =>
    navigate({ to: navPaths.tagEdit(tag.id, language) as never })
  const handleDelete = (tag: Tag) => setDeletingTag(tag)

  const handleConfirmDelete = () => {
    if (!deletingTag) return
    softDelete.mutate(deletingTag.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingTag(null)
      },
      onError: onQueuedOr(() => setDeletingTag(null)),
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
    setParams((p) => ({
      ...p,
      page: 1,
      isActive: value === 'all' ? undefined : value === 'active',
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'active', label: t.filters.statusActive },
    { value: 'inactive', label: t.filters.statusInactive },
  ]

  const statusValue = statusValueFor(params.isActive)

  return {
    t,
    language,
    search,
    statusValue,
    tags,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingTag,
    viewingTag,
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
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingTag,
    setViewingTag,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
