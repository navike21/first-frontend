import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader } from '@/shared/ui'
import { UserForm, useCreateUser } from '@/features/users'
import { useUsersTranslation } from '@/features/users/i18n'
import type { CreateUserFormData } from '@/features/users'
import { NAV } from '@/shared/router'

export const CreateUserPage = () => {
  const navigate = useNavigate()
  const { t } = useUsersTranslation()
  const createUser = useCreateUser()

  const handleCreate = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: NAV.users.path })
      },
      onError: (error) => notify.queryError(error),
    })
  }

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader title={t.page.createTitle} description={t.page.createDescription} />
      <div className="max-w-lg">
        <UserForm
          mode="create"
          isSubmitting={createUser.isPending}
          onCancel={() => navigate({ to: NAV.users.path })}
          onCreate={handleCreate}
          onUpdate={() => {}}
        />
      </div>
    </div>
  )
}
