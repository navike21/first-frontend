import { useState } from 'react'
import { PageHeader, InputField, Select } from '@/shared/ui'
import { UserTable, UserForm } from '@/features/users'
import { useUsers, useCreateUser, useUpdateUser, useSoftDeleteUser } from '@/features/users'
import type { User, UserListParams } from '@/features/users'
import type { CreateUserFormData, UpdateUserFormData } from '@/features/users'
import { toast } from 'sonner'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
]

export const UsersPage = () => {
  const [params, setParams] = useState<UserListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const { data, isLoading } = useUsers({ ...params, search: search || undefined })
  const createUser = useCreateUser()
  const updateUser = useUpdateUser(editingUser?.id ?? '')
  const softDelete = useSoftDeleteUser()

  const handleCreate = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        toast.success('Usuario creado correctamente')
        setFormOpen(false)
      },
      onError: () => toast.error('Error al crear el usuario'),
    })
  }

  const handleUpdate = (data: UpdateUserFormData) => {
    updateUser.mutate(data, {
      onSuccess: () => {
        toast.success('Usuario actualizado correctamente')
        setFormOpen(false)
        setEditingUser(null)
      },
      onError: () => toast.error('Error al actualizar el usuario'),
    })
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormOpen(true)
  }

  const handleDelete = (user: User) => {
    if (!confirm(`¿Desactivar a ${user.firstName} ${user.lastName}?`)) return
    softDelete.mutate(user.id, {
      onSuccess: () => toast.success('Usuario desactivado'),
      onError: () => toast.error('Error al desactivar el usuario'),
    })
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios del sistema"
        actions={[
          {
            type: 'button',
            label: 'Nuevo usuario',
            icon: 'RiAddLine',
            variant: 'primary',
            onClick: () => {
              setEditingUser(null)
              setFormOpen(true)
            },
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
            leftSlot={<span className="text-slate-400 text-sm px-3">🔍</span>}
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            label="Estado"
            options={STATUS_OPTIONS}
            value={params.status ?? ''}
            onChange={(val) =>
              setParams((p) => ({
                ...p,
                page: 1,
                status: val ? (val as 'active' | 'inactive') : undefined,
              }))
            }
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

      <UserForm
        isOpen={formOpen}
        mode={editingUser ? 'edit' : 'create'}
        defaultValues={editingUser ?? undefined}
        isSubmitting={createUser.isPending || updateUser.isPending}
        onClose={handleFormClose}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
