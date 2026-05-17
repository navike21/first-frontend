import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader } from '@/shared/ui'
import { UserForm, useCreateUser } from '@/features/users'
import type { CreateUserFormData } from '@/features/users'
import { NAV } from '@/shared/router'

export const CreateUserPage = () => {
  const navigate = useNavigate()
  const createUser = useCreateUser()

  const handleCreate = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        notify.success('Usuario creado correctamente')
        navigate({ to: NAV.users.path })
      },
      onError: (error) => notify.queryError(error),
    })
  }

  const handleCancel = () => navigate({ to: NAV.users.path })

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title="Nuevo usuario"
        description="Completa los campos para registrar un nuevo usuario en el sistema"
      />

      <div className="max-w-lg">
        <UserForm
          mode="create"
          isSubmitting={createUser.isPending}
          onCancel={handleCancel}
          onCreate={handleCreate}
          onUpdate={() => {}}
        />
      </div>
    </div>
  )
}
