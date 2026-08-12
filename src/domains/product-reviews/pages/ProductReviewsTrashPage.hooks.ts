import { useState, useMemo } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useProductReviewsTrash,
  useRestoreProductReview,
  usePurgeProductReview,
  useBulkRestoreProductReviews,
  useBulkPurgeProductReviews,
  useProductsForReviewPicker,
  useCustomersForReviewPicker,
} from '../api/productReviews.queries'
import { useProductReviewsTranslation } from '../i18n'
import type { ProductReview, ProductReviewPaginationMeta } from '../model/productReview.types'

export function useProductReviewsTrashPage() {
  const { t, language } = useProductReviewsTranslation()
  const [page, setPage] = useState(1)
  const [restoring, setRestoring] = useState<ProductReview | null>(null)
  const [purging, setPurging] = useState<ProductReview | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = useProductReviewsTrash({ page, limit: 20 })
  const { data: products } = useProductsForReviewPicker()
  const { data: customers } = useCustomersForReviewPicker()
  const restore = useRestoreProductReview()
  const purge = usePurgeProductReview()
  const bulkRestore = useBulkRestoreProductReviews()
  const bulkPurge = useBulkPurgeProductReviews()

  const reviews = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as ProductReviewPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1

  const productNameById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const product of products ?? []) {
      map[product.id] = product.name[language] || product.name.en || product.id
    }
    return map
  }, [products, language])

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
    purge.mutate(purging.id, {
      onSuccess: () => {
        notify.success(t.toasts.purged)
        setPurging(null)
      },
      onError: onQueuedOr(() => setPurging(null)),
    })
  }

  const handleConfirmBulk = () => {
    const mutation = bulkAction === 'restore' ? bulkRestore : bulkPurge
    const toast = bulkAction === 'restore' ? t.toasts.bulkRestored : t.toasts.bulkPurged
    mutation.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(toast)
        clearSelection()
        setBulkAction(null)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkAction(null)
      }),
    })
  }

  const handlePageChange = (next: number) => {
    setPage(next)
    clearSelection()
  }

  return {
    t,
    language,
    reviews,
    productNameById,
    reviewerLabel,
    total,
    pages,
    page,
    isLoading,
    isFetching,
    restoring,
    purging,
    selectedIds,
    bulkAction,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    setRestoring,
    setPurging,
    setSelectedIds,
    setBulkAction,
    clearSelection,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulk,
    handlePageChange,
  }
}
