import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useServices,
  useSoftDeleteService,
  useBulkSoftDeleteServices,
} from '../api/services.queries'
import { useServicesTranslation } from '../i18n'
import type { Service, ServiceListParams, ServicePaginationMeta } from '../model/service.types'

export function useServicesPage() {
  const navigate = useNavigate()
  const { t, language } = useServicesTranslation()
  const [params, setParams] = useState<ServiceListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [viewingService, setViewingService] = useState<Service | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading } = useServices({ ...params, search: search || undefined })
  const softDelete = useSoftDeleteService()
  const bulkSoftDelete = useBulkSoftDeleteServices()

  const services = data?.data ?? []
  const meta = data?.meta as ServicePaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (service: Service) => setViewingService(service)
  const handleEdit = (service: Service) =>
    navigate({ to: navPaths.serviceEdit(service.id, language) as never })
  const handleDelete = (service: Service) => setDeletingService(service)

  const handleConfirmDelete = () => {
    if (!deletingService) return
    softDelete.mutate(deletingService.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingService(null)
      },
      onError: onQueuedOr(() => setDeletingService(null)),
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
    services,
    total,
    page,
    pages,
    isLoading,
    deletingService,
    viewingService,
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
    setDeletingService,
    setViewingService,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
