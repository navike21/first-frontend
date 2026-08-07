import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useProductCategories,
  useSoftDeleteProductCategory,
  useBulkSoftDeleteProductCategories,
} from '../api/productCategories.queries'
import { useProductCategoriesTranslation } from '../i18n'
import type {
  ProductCategory,
  ProductCategoryListParams,
  ProductCategoryPaginationMeta,
} from '../model/productCategory.types'

function statusValueFor(
  isActive: boolean | undefined
): 'all' | 'active' | 'inactive' {
  if (isActive === undefined) return 'all'
  return isActive ? 'active' : 'inactive'
}

export function useProductCategoriesPage() {
  const navigate = useNavigate()
  const { t, language } = useProductCategoriesTranslation()
  const [params, setParams] = useState<ProductCategoryListParams>({
    page: 1,
    limit: 20,
  })
  const [search, setSearch] = useState('')
  const [deletingCategory, setDeletingCategory] =
    useState<ProductCategory | null>(null)
  const [viewingCategory, setViewingCategory] =
    useState<ProductCategory | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useProductCategories({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteProductCategory()
  const bulkSoftDelete = useBulkSoftDeleteProductCategories()

  const categories = data?.data ?? []
  const meta = data?.meta as ProductCategoryPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (category: ProductCategory) => setViewingCategory(category)
  const handleEdit = (category: ProductCategory) =>
    navigate({
      to: navPaths.productCategoryEdit(category.id, language) as never,
    })
  const handleDelete = (category: ProductCategory) =>
    setDeletingCategory(category)

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
    isFetching,
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
