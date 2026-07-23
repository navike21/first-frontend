import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useSubscribers,
  useSoftDeleteSubscriber,
  useBulkSoftDeleteSubscribers,
} from '../api/subscribers.queries'
import { useSubscribersTranslation } from '../i18n'
import type {
  Subscriber,
  SubscriberListParams,
  SubscriberPaginationMeta,
} from '../model/subscriber.types'

export function useSubscribersPage() {
  const navigate = useNavigate()
  const { t, language } = useSubscribersTranslation()
  const [params, setParams] = useState<SubscriberListParams>({
    page: 1,
    limit: 20,
  })
  const [search, setSearch] = useState('')
  const [deletingSubscriber, setDeletingSubscriber] =
    useState<Subscriber | null>(null)
  const [viewingSubscriber, setViewingSubscriber] = useState<Subscriber | null>(
    null
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useSubscribers({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteSubscriber()
  const bulkSoftDelete = useBulkSoftDeleteSubscribers()

  const subscribers = data?.data ?? []
  const meta = data?.meta as SubscriberPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (subscriber: Subscriber) =>
    setViewingSubscriber(subscriber)
  const handleEdit = (subscriber: Subscriber) =>
    navigate({ to: navPaths.subscriberEdit(subscriber.id, language) as never })
  const handleDelete = (subscriber: Subscriber) =>
    setDeletingSubscriber(subscriber)

  const handleConfirmDelete = () => {
    if (!deletingSubscriber) return
    softDelete.mutate(deletingSubscriber.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingSubscriber(null)
      },
      onError: onQueuedOr(() => setDeletingSubscriber(null)),
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
      status: value === 'all' ? undefined : (value as 'active' | 'inactive'),
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

  return {
    t,
    language,
    params,
    search,
    subscribers,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingSubscriber,
    viewingSubscriber,
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
    setDeletingSubscriber,
    setViewingSubscriber,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
