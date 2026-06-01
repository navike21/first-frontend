import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { useUserGroups, useSoftDeleteUserGroup } from '@/features/user-groups'
import { useUserGroupsTranslation } from '@/features/user-groups/i18n'
import type { UserGroup, UserGroupListParams } from '@/features/user-groups'
import { navPaths } from '@/shared/router'

export function useUserGroupsPage() {
  const navigate = useNavigate()
  const { t, language } = useUserGroupsTranslation()
  const [params, setParams] = useState<UserGroupListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [viewingGroup, setViewingGroup] = useState<UserGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<UserGroup | null>(null)

  const { data, isLoading } = useUserGroups({ ...params, search: search || undefined })
  const softDelete = useSoftDeleteUserGroup()

  const handleView = (group: UserGroup) => setViewingGroup(group)

  const handleEdit = (group: UserGroup) =>
    navigate({ to: navPaths.userGroupEdit(group.id, language) as never })

  const handleDelete = (group: UserGroup) => setDeletingGroup(group)

  const handleConfirmDelete = () => {
    if (!deletingGroup) return
    softDelete.mutate(deletingGroup.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingGroup(null)
      },
      onError: (error) => notify.queryError(error),
    })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setParams((p) => ({ ...p, page: 1 }))
  }

  const handleStatusChange = (value: string) => {
    setParams((p) => ({
      ...p,
      page: 1,
      status: value === 'all' ? undefined : (value as 'active' | 'inactive'),
    }))
  }

  const handlePageChange = (page: number) =>
    setParams((prev) => ({ ...prev, page }))

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
    viewingGroup,
    deletingGroup,
    data,
    isLoading,
    softDelete,
    statusOptions,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setViewingGroup,
    setDeletingGroup,
  }
}
