import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useSubscribersTrash,
  useRestoreSubscriber,
  usePurgeSubscriber,
  useBulkRestoreSubscribers,
  useBulkPurgeSubscribers,
} from '../api/subscribers.queries'
import { useSubscribersTranslation } from '../i18n'
import type {
  Subscriber,
  SubscriberPaginationMeta,
} from '../model/subscriber.types'

export function useSubscribersTrashPage() {
  const { t, language } = useSubscribersTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Subscriber | null>(null)
  const [restoring, setRestoring] = useState<Subscriber | null>(null)
  const [purging, setPurging] = useState<Subscriber | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading } = useSubscribersTrash({ page, limit: 20 })
  const restore = useRestoreSubscriber()
  const purge = usePurgeSubscriber()
  const bulkRestore = useBulkRestoreSubscribers()
  const bulkPurge = useBulkPurgeSubscribers()

  const subscribers = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as SubscriberPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1

  const clearSelection = () => setSelectedIds([])

  const subName = (s: Subscriber) => `${s.firstName} ${s.lastName}`

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
    const toast =
      bulkAction === 'restore' ? t.toasts.bulkRestored : t.toasts.bulkPurged
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
    subscribers,
    total,
    pages,
    page,
    isLoading,
    viewing,
    restoring,
    purging,
    selectedIds,
    bulkAction,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    subName,
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
