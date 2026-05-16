import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PageHeader, Breadcrumbs } from '@/shared/ui'
import { UserForm } from '@/features/users'
import { useCreateUser } from '@/features/users'
import type { CreateUserFormData } from '@/features/users'
import { NAV } from '@/shared/router'

export const CreateUserPage = () => {
  const navigate = useNavigate()
  const createUser = useCreateUser()

  const handleCreate = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        toast.success('Usuario creado correctamente')
        void navigate({ to: NAV.users.path })
      },
      onError: () => toast.error('Error al crear el usuario'),
    })
  }

  const handleCancel = () => void navigate({ to: NAV.users.path })

  return (
    <div className="animate-page-in space-y-6">
      <Breadcrumbs
        items={[
          { label: NAV.users.label, href: NAV.users.path },
          { label: NAV.userCreate.label },
        ]}
      />

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
