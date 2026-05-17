import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader } from '@/shared/ui'
import { UserForm, useCreateUser } from '@/features/users'
import { useUsersTranslation } from '@/features/users/i18n'
import type { CreateUserFormData } from '@/features/users'
import { navPaths } from '@/shared/router'

export const CreateUserPage = () => {
  const navigate = useNavigate()
  const { t, language } = useUsersTranslation()
  const createUser = useCreateUser()

  const handleCreate = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.users(language) as never })
      },
      onError: (error) => notify.queryError(error),
    })
  }

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader title={t.page.createTitle} description={t.page.createDescription} />
      <div>
        <UserForm
          mode="create"
          isSubmitting={createUser.isPending}
          onCancel={() => navigate({ to: navPaths.users(language) as never })}
          onCreate={handleCreate}
          onUpdate={() => {}}
        />
      </div>
    </div>
  )
}
