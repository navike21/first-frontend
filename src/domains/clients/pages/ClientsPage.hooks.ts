import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useClients,
  useSoftDeleteClient,
  useBulkSoftDeleteClients,
} from '../api/clients.queries'
import { useClientsTranslation } from '../i18n'
import type {
  Client,
  ClientListParams,
  ClientPaginationMeta,
} from '../model/client.types'

export function useClientsPage() {
  const navigate = useNavigate()
  const { t, language } = useClientsTranslation()
  const [params, setParams] = useState<ClientListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [viewingClient, setViewingClient] = useState<Client | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useClients({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteClient()
  const bulkSoftDelete = useBulkSoftDeleteClients()

  const clients = data?.data ?? []
  const meta = data?.meta as ClientPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (client: Client) => setViewingClient(client)
  const handleEdit = (client: Client) =>
    navigate({ to: navPaths.clientEdit(client.id, language) as never })
  const handleDelete = (client: Client) => setDeletingClient(client)

  const handleConfirmDelete = () => {
    if (!deletingClient) return
    softDelete.mutate(deletingClient.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingClient(null)
      },
      onError: onQueuedOr(() => setDeletingClient(null)),
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
    clients,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingClient,
    viewingClient,
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
    setDeletingClient,
    setViewingClient,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
