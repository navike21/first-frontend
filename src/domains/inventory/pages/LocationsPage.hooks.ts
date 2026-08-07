import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useLocations,
  useSoftDeleteLocation,
  useBulkSoftDeleteLocations,
} from '../api/locations.queries'
import { useInventoryTranslation } from '../i18n'
import type {
  Location,
  LocationListParams,
  LocationPaginationMeta,
} from '../model/location.types'

function statusValueFor(
  isActive: boolean | undefined
): 'all' | 'active' | 'inactive' {
  if (isActive === undefined) return 'all'
  return isActive ? 'active' : 'inactive'
}

export function useLocationsPage() {
  const navigate = useNavigate()
  const { t, language } = useInventoryTranslation()
  const [params, setParams] = useState<LocationListParams>({
    page: 1,
    limit: 20,
  })
  const [search, setSearch] = useState('')
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(
    null
  )
  const [viewingLocation, setViewingLocation] = useState<Location | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useLocations({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteLocation()
  const bulkSoftDelete = useBulkSoftDeleteLocations()

  const locations = data?.data ?? []
  const meta = data?.meta as LocationPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (location: Location) => setViewingLocation(location)
  const handleEdit = (location: Location) =>
    navigate({ to: navPaths.locationEdit(location.id, language) as never })
  const handleDelete = (location: Location) => setDeletingLocation(location)

  const handleConfirmDelete = () => {
    if (!deletingLocation) return
    softDelete.mutate(deletingLocation.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingLocation(null)
      },
      onError: onQueuedOr(() => setDeletingLocation(null)),
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
      isActive: value === 'all' ? undefined : value === 'active',
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

  const statusValue = statusValueFor(params.isActive)

  return {
    t,
    language,
    search,
    statusValue,
    locations,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingLocation,
    viewingLocation,
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
    setDeletingLocation,
    setViewingLocation,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
