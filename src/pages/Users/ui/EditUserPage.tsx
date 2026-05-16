import { useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PageHeader, Breadcrumbs, Spinner } from '@/shared/ui'
import { UserForm } from '@/features/users'
import { useUser, useUpdateUser } from '@/features/users'
import type { UpdateUserFormData } from '@/features/users'
import { NAV } from '@/shared/router'

export const EditUserPage = () => {
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false }) as { userId: string }

  const { data: user, isLoading } = useUser(userId)
  const updateUser = useUpdateUser(userId)

  useEffect(() => {
    if (!isLoading && !user) {
      void navigate({ to: NAV.users.path, replace: true })
    }
  }, [isLoading, user, navigate])

  const handleUpdate = (data: UpdateUserFormData) => {
    updateUser.mutate(data, {
      onSuccess: () => {
        toast.success('Usuario actualizado correctamente')
        void navigate({ to: NAV.users.path })
      },
      onError: () => toast.error('Error al actualizar el usuario'),
    })
  }

  const handleCancel = () => void navigate({ to: NAV.users.path })

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner size="medium" />
      </div>
    )
  }

  const userName = `${user.firstName} ${user.lastName}`

  return (
    <div className="animate-page-in space-y-6">
      <Breadcrumbs
        items={[
          { label: NAV.users.label, href: NAV.users.path },
          { label: userName },
        ]}
      />

      <PageHeader
        title="Editar usuario"
        description={`Modifica los datos de ${userName}`}
      />

      <div className="max-w-lg">
        <UserForm
          mode="edit"
          defaultValues={user}
          isSubmitting={updateUser.isPending}
          onCancel={handleCancel}
          onCreate={() => {}}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}
