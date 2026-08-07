import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useCouponsTrash,
  useRestoreCoupon,
  usePurgeCoupon,
  useBulkRestoreCoupons,
  useBulkPurgeCoupons,
  useCurrencyForCouponPicker,
} from '../api/coupons.queries'
import { useCouponsTranslation } from '../i18n'
import type { Coupon, CouponPaginationMeta } from '../model/coupon.types'

export function useCouponsTrashPage() {
  const { t, language } = useCouponsTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Coupon | null>(null)
  const [restoring, setRestoring] = useState<Coupon | null>(null)
  const [purging, setPurging] = useState<Coupon | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = useCouponsTrash({ page, limit: 20 })
  const { data: currency = 'USD' } = useCurrencyForCouponPicker()
  const restore = useRestoreCoupon()
  const purge = usePurgeCoupon()
  const bulkRestore = useBulkRestoreCoupons()
  const bulkPurge = useBulkPurgeCoupons()

  const coupons = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as CouponPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1

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
    coupons,
    currency,
    total,
    pages,
    page,
    isLoading,
    isFetching,
    viewing,
    restoring,
    purging,
    selectedIds,
    bulkAction,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    setViewing,
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
