import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useCategories,
  useSoftDeleteCategory,
  useBulkSoftDeleteCategories,
} from '../api/categories.queries'
import { useCategoriesTranslation } from '../i18n'
import type {
  Category,
  CategoryListParams,
  CategoryPaginationMeta,
} from '../model/category.types'

function statusValueFor(
  isActive: boolean | undefined
): 'all' | 'active' | 'inactive' {
  if (isActive === undefined) return 'all'
  return isActive ? 'active' : 'inactive'
}

export function useCategoriesPage() {
  const navigate = useNavigate()
  const { t, language } = useCategoriesTranslation()
  const [params, setParams] = useState<CategoryListParams>({
    page: 1,
    limit: 20,
  })
  const [search, setSearch] = useState('')
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  )
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading } = useCategories({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteCategory()
  const bulkSoftDelete = useBulkSoftDeleteCategories()

  const categories = data?.data ?? []
  const meta = data?.meta as CategoryPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (category: Category) => setViewingCategory(category)
  const handleEdit = (category: Category) =>
    navigate({ to: navPaths.categoryEdit(category.id, language) as never })
  const handleDelete = (category: Category) => setDeletingCategory(category)

  const handleConfirmDelete = () => {
    if (!deletingCategory) return
    softDelete.mutate(deletingCategory.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingCategory(null)
      },
      onError: onQueuedOr(() => setDeletingCategory(null)),
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
    categories,
    total,
    page,
    pages,
    isLoading,
    deletingCategory,
    viewingCategory,
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
    setDeletingCategory,
    setViewingCategory,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
