import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useProducts,
  useSoftDeleteProduct,
  useBulkSoftDeleteProducts,
} from '../api/products.queries'
import { useProductTranslation } from '../i18n'
import type {
  Product,
  ProductListParams,
  ProductPaginationMeta,
} from '../model/product.types'

function statusValueFor(
  isActive: boolean | undefined
): 'all' | 'active' | 'inactive' {
  if (isActive === undefined) return 'all'
  return isActive ? 'active' : 'inactive'
}

export function useProductsPage() {
  const navigate = useNavigate()
  const { t, language } = useProductTranslation()
  const [params, setParams] = useState<ProductListParams>({
    page: 1,
    limit: 20,
  })
  const [search, setSearch] = useState('')
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useProducts({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteProduct()
  const bulkSoftDelete = useBulkSoftDeleteProducts()

  const products = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as ProductPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (product: Product) => setViewingProduct(product)
  const handleEdit = (product: Product) =>
    navigate({ to: navPaths.productEdit(product.id, language) as never })
  const handleDelete = (product: Product) => setDeletingProduct(product)

  const handleConfirmDelete = () => {
    if (!deletingProduct) return
    softDelete.mutate(deletingProduct.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingProduct(null)
      },
      onError: onQueuedOr(() => setDeletingProduct(null)),
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
    products,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingProduct,
    viewingProduct,
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
    setDeletingProduct,
    setViewingProduct,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
