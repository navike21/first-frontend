import { useState, useMemo } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useProductReviews,
  useApproveProductReview,
  useRejectProductReview,
  useSoftDeleteProductReview,
  useBulkSoftDeleteProductReviews,
  useProductsForReviewPicker,
  useCustomersForReviewPicker,
  type ProductReviewCustomerPickerItem,
} from '../api/productReviews.queries'
import { useProductReviewsTranslation } from '../i18n'
import type {
  ProductReview,
  ProductReviewListParams,
  ProductReviewPaginationMeta,
} from '../model/productReview.types'

function valueFor(value: string | undefined): string {
  return value ?? 'all'
}

export function useProductReviewsPage() {
  const { t, language } = useProductReviewsTranslation()
  const [params, setParams] = useState<ProductReviewListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState<ProductReview | null>(null)
  const [deleting, setDeleting] = useState<ProductReview | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useProductReviews({
    ...params,
    search: search || undefined,
  })
  const { data: products } = useProductsForReviewPicker()
  const { data: customers } = useCustomersForReviewPicker()
  const approve = useApproveProductReview()
  const reject = useRejectProductReview()
  const softDelete = useSoftDeleteProductReview()
  const bulkSoftDelete = useBulkSoftDeleteProductReviews()

  const reviews = data?.data ?? []
  const meta = data?.meta as ProductReviewPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const productNameById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const product of products ?? []) {
      map[product.id] = product.name[language] || product.name.en || product.id
    }
    return map
  }, [products, language])

  const customersById = useMemo(() => {
    const map: Record<string, ProductReviewCustomerPickerItem> = {}
    for (const customer of customers ?? []) {
      map[customer.id] = customer
    }
    return map
  }, [customers])

  const reviewerNameById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const customer of customers ?? []) {
      map[customer.id] = `${customer.firstName} ${customer.lastName}`
    }
    return map
  }, [customers])

  const reviewerLabel = (review: ProductReview): string =>
    review.customerId
      ? (reviewerNameById[review.customerId] ?? review.guestName ?? '—')
      : (review.guestName ?? '—')

  const clearSelection = () => setSelectedIds([])

  const handleView = (review: ProductReview) => setViewing(review)
  const handleDelete = (review: ProductReview) => setDeleting(review)

  const handleApprove = (review: ProductReview) => {
    approve.mutate(review.id, {
      onSuccess: () => notify.success(t.toasts.approved),
      onError: onQueuedOr(() => {}),
    })
  }

  const handleReject = (review: ProductReview) => {
    reject.mutate(review.id, {
      onSuccess: () => notify.success(t.toasts.rejected),
      onError: onQueuedOr(() => {}),
    })
  }

  const handleConfirmDelete = () => {
    if (!deleting) return
    softDelete.mutate(deleting.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeleting(null)
      },
      onError: onQueuedOr(() => setDeleting(null)),
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
      status: value === 'all' ? undefined : (value as ProductReviewListParams['status']),
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'pending', label: t.status.pending },
    { value: 'approved', label: t.status.approved },
    { value: 'rejected', label: t.status.rejected },
  ]

  const statusValue = valueFor(params.status)

  return {
    t,
    language,
    search,
    statusValue,
    reviews,
    productNameById,
    customersById,
    reviewerNameById,
    reviewerLabel,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    viewing,
    deleting,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleView,
    handleDelete,
    handleApprove,
    handleReject,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setViewing,
    setDeleting,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
