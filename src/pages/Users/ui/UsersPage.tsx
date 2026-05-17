import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PageHeader, InputField, Select, Modal, Button, IconComponent } from '@/shared/ui'
import { useUsers, useSoftDeleteUser, UserTable } from '@/features/users'
import type { User, UserListParams } from '@/features/users'
import { NAV } from '@/shared/router'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
]

export const UsersPage = () => {
  const navigate = useNavigate()
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
        toast.success('Usuario desactivado correctamente')
        setDeletingUser(null)
      },
      onError: () => toast.error('Error al desactivar el usuario'),
    })
  }

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios del sistema"
        actions={[
          {
            type: 'link',
            label: 'Nuevo usuario',
            icon: 'RiAddLine',
            variant: 'error',
            to: NAV.userCreate.path,
            size: 'small',
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <InputField
            label="Buscar"
            placeholder="Nombre, apellido o email…"
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
            label="Estado"
            options={STATUS_OPTIONS}
            value={params.status ?? 'all'}
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

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        size="sm"
        title="Desactivar usuario"
        description={
          deletingUser
            ? `¿Confirmas que deseas desactivar a ${deletingUser.firstName} ${deletingUser.lastName}? El usuario perderá acceso al sistema.`
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingUser(null)}
              disabled={softDelete.isPending}
            >
              Cancelar
            </Button>
            <Button variant="error" loading={softDelete.isPending} onClick={handleConfirmDelete}>
              Desactivar
            </Button>
          </>
        }
      />
    </div>
  )
}
