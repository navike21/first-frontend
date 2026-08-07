import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  usePaymentMethods,
  useSoftDeletePaymentMethod,
  useBulkSoftDeletePaymentMethods,
} from '../api/paymentMethods.queries'
import { usePaymentsTranslation } from '../i18n'
import type {
  PaymentMethod,
  PaymentMethodListParams,
  PaymentMethodPaginationMeta,
} from '../model/payment.types'

export function usePaymentMethodsPage() {
  const navigate = useNavigate()
  const { t, language } = usePaymentsTranslation()
  const [params, setParams] = useState<PaymentMethodListParams>({ page: 1, limit: 20 })
  const [deletingMethod, setDeletingMethod] = useState<PaymentMethod | null>(null)
  const [viewingMethod, setViewingMethod] = useState<PaymentMethod | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = usePaymentMethods(params)
  const softDelete = useSoftDeletePaymentMethod()
  const bulkSoftDelete = useBulkSoftDeletePaymentMethods()

  const methods = data?.data ?? []
  const meta = data?.meta as PaymentMethodPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (method: PaymentMethod) => setViewingMethod(method)
  const handleEdit = (method: PaymentMethod) =>
    navigate({ to: navPaths.paymentMethodEdit(method.id, language) as never })
  const handleDelete = (method: PaymentMethod) => setDeletingMethod(method)

  const handleConfirmDelete = () => {
    if (!deletingMethod) return
    softDelete.mutate(deletingMethod.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingMethod(null)
      },
      onError: onQueuedOr(() => setDeletingMethod(null)),
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

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  return {
    t,
    language,
    methods,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingMethod,
    viewingMethod,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handlePageChange,
    setDeletingMethod,
    setViewingMethod,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
