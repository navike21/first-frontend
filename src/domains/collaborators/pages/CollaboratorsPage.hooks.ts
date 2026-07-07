import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useCollaborators,
  useSoftDeleteCollaborator,
  useBulkSoftDeleteCollaborators,
} from '../api/collaborators.queries'
import { useCollaboratorsTranslation } from '../i18n'
import type { Collaborator, CollaboratorListParams, CollaboratorPaginationMeta } from '../model/collaborator.types'

function statusValueFor(isActive: boolean | undefined): 'all' | 'active' | 'inactive' {
  if (isActive === undefined) return 'all'
  return isActive ? 'active' : 'inactive'
}

export function useCollaboratorsPage() {
  const navigate = useNavigate()
  const { t, language } = useCollaboratorsTranslation()
  const [params, setParams] = useState<CollaboratorListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingCollaborator, setDeletingCollaborator] = useState<Collaborator | null>(null)
  const [viewingCollaborator, setViewingCollaborator] = useState<Collaborator | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading } = useCollaborators({ ...params, search: search || undefined })
  const softDelete = useSoftDeleteCollaborator()
  const bulkSoftDelete = useBulkSoftDeleteCollaborators()

  const collaborators = data?.data ?? []
  const meta = data?.meta as CollaboratorPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (collaborator: Collaborator) => setViewingCollaborator(collaborator)
  const handleEdit = (collaborator: Collaborator) =>
    navigate({ to: navPaths.collaboratorEdit(collaborator.id, language) as never })
  const handleDelete = (collaborator: Collaborator) => setDeletingCollaborator(collaborator)

  const handleConfirmDelete = () => {
    if (!deletingCollaborator) return
    softDelete.mutate(deletingCollaborator.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingCollaborator(null)
      },
      onError: onQueuedOr(() => setDeletingCollaborator(null)),
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
    params,
    search,
    statusValue,
    collaborators,
    total,
    page,
    pages,
    isLoading,
    deletingCollaborator,
    viewingCollaborator,
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
    setDeletingCollaborator,
    setViewingCollaborator,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
