import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useCoupons,
  useSoftDeleteCoupon,
  useBulkSoftDeleteCoupons,
  useCurrencyForCouponPicker,
} from '../api/coupons.queries'
import { useCouponsTranslation } from '../i18n'
import type {
  Coupon,
  CouponListParams,
  CouponPaginationMeta,
} from '../model/coupon.types'

function statusValueFor(status: string | undefined): string {
  return status ?? 'all'
}

export function useCouponsPage() {
  const navigate = useNavigate()
  const { t, language } = useCouponsTranslation()
  const [params, setParams] = useState<CouponListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null)
  const [viewingCoupon, setViewingCoupon] = useState<Coupon | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useCoupons({
    ...params,
    search: search || undefined,
  })
  const { data: currency = 'USD' } = useCurrencyForCouponPicker()
  const softDelete = useSoftDeleteCoupon()
  const bulkSoftDelete = useBulkSoftDeleteCoupons()

  const coupons = data?.data ?? []
  const meta = data?.meta as CouponPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (coupon: Coupon) => setViewingCoupon(coupon)
  const handleEdit = (coupon: Coupon) =>
    navigate({ to: navPaths.couponEdit(coupon.id, language) as never })
  const handleDelete = (coupon: Coupon) => setDeletingCoupon(coupon)

  const handleConfirmDelete = () => {
    if (!deletingCoupon) return
    softDelete.mutate(deletingCoupon.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingCoupon(null)
      },
      onError: onQueuedOr(() => setDeletingCoupon(null)),
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
    setParams((p) => ({ ...p, page: 1, status: value === 'all' ? undefined : value }))
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

  const statusValue = statusValueFor(params.status)

  return {
    t,
    language,
    search,
    statusValue,
    coupons,
    currency,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingCoupon,
    viewingCoupon,
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
    setDeletingCoupon,
    setViewingCoupon,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
