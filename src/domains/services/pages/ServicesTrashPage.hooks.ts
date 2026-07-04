import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useServicesTrash,
  useRestoreService,
  usePurgeService,
  useBulkRestoreServices,
  useBulkPurgeServices,
} from '../api/services.queries'
import { useServicesTranslation } from '../i18n'
import type { Service, ServicePaginationMeta } from '../model/service.types'

export function useServicesTrashPage() {
  const { t, language } = useServicesTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Service | null>(null)
  const [restoring, setRestoring] = useState<Service | null>(null)
  const [purging, setPurging] = useState<Service | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading } = useServicesTrash({ page, limit: 20 })
  const restore = useRestoreService()
  const purge = usePurgeService()
  const bulkRestore = useBulkRestoreServices()
  const bulkPurge = useBulkPurgeServices()

  const services = data?.data ?? []
  const meta = data?.meta as ServicePaginationMeta | undefined
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
    services,
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
