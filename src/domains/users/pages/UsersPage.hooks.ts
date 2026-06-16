import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { useUsers, useSoftDeleteUser } from '..'
import { useUsersTranslation } from '../i18n'
import type { User, UserListParams } from '..'
import { navPaths } from '@/shared/router'

export function useUsersPage() {
  const navigate = useNavigate()
  const { t, language } = useUsersTranslation()
  const [params, setParams] = useState<UserListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const { data, isLoading } = useUsers({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteUser()

  const handleEdit = (user: User) =>
    navigate({ to: navPaths.userEdit(user.id, language) as never })

  const handleDelete = (user: User) => setDeletingUser(user)

  const handleConfirmDelete = () => {
    if (!deletingUser) return
    softDelete.mutate(deletingUser.id, {
      onSuccess: () => {
        notify.success(t.toasts.deactivated)
        setDeletingUser(null)
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
    deletingUser,
    data,
    isLoading,
    softDelete,
    statusOptions,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingUser,
  }
}
