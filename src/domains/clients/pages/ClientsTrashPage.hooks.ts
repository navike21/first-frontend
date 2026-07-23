import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useClientsTrash,
  useRestoreClient,
  usePurgeClient,
  useBulkRestoreClients,
  useBulkPurgeClients,
} from '../api/clients.queries'
import { useClientsTranslation } from '../i18n'
import type { Client, ClientPaginationMeta } from '../model/client.types'

export function useClientsTrashPage() {
  const { t, language } = useClientsTranslation()
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Client | null>(null)
  const [restoring, setRestoring] = useState<Client | null>(null)
  const [purging, setPurging] = useState<Client | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = useClientsTrash({ page, limit: 20 })
  const restore = useRestoreClient()
  const purge = usePurgeClient()
  const bulkRestore = useBulkRestoreClients()
  const bulkPurge = useBulkPurgeClients()

  const clients = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as ClientPaginationMeta | undefined
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
    clients,
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
