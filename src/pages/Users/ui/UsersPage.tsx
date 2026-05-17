import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader, InputField, Select, Modal, Button, IconComponent } from '@/shared/ui'
import { useUsers, useSoftDeleteUser, UserTable } from '@/features/users'
import { useUsersTranslation } from '@/features/users/i18n'
import type { User, UserListParams } from '@/features/users'
import { NAV } from '@/shared/router'

export const UsersPage = () => {
  const navigate = useNavigate()
  const { t, language } = useUsersTranslation()
  const [params, setParams] = useState<UserListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const { data, isLoading } = useUsers({ ...params, search: search || undefined })
  const softDelete = useSoftDeleteUser()

  const handleEdit = (user: User) => navigate({ to: `/usuarios/${user.id}/editar` })
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

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'active', label: t.filters.statusActive },
    { value: 'inactive', label: t.filters.statusInactive },
  ]

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title={t.page.listTitle}
        description={t.page.listDescription}
        actions={[
          {
            type: 'link',
            label: t.actions.newUser,
            icon: 'RiAddLine',
            variant: 'error',
            to: NAV.userCreate.path,
            size: 'small',
          },
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <InputField
            label={t.filters.searchLabel}
            placeholder={t.filters.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setParams((p) => ({ ...p, page: 1 }))
            }}
            leftSlot={
              <span className="px-3 text-slate-400">
                <IconComponent icon="RiSearchLine" className="h-4 w-4" />
              </span>
            }
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            label={t.filters.statusLabel}
            options={statusOptions}
            value={params.status ?? 'all'}
            lang={language}
            onChange={(e) => {
              const value = e.target.value
              setParams((p) => ({
                ...p,
                page: 1,
                status: value === 'all' ? undefined : (value as 'active' | 'inactive'),
              }))
            }}
          />
        </div>
      </div>

      <UserTable
        users={data?.items ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={data?.page ?? 1}
        pages={data?.pages ?? 1}
        onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        size="sm"
        title={t.actions.deactivateTitle}
        description={
          deletingUser
            ? t.actions.deactivateDescription(deletingUser.firstName, deletingUser.lastName)
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingUser(null)}
              disabled={softDelete.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button variant="error" loading={softDelete.isPending} onClick={handleConfirmDelete}>
              {t.actions.confirmDeactivate}
            </Button>
          </>
        }
      />
    </div>
  )
}
