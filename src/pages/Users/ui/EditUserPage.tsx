import { useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader, Spinner } from '@/shared/ui'
import { UserForm, useUser, useUpdateUser } from '@/features/users'
import { useUsersTranslation } from '@/features/users/i18n'
import type { UpdateUserFormData } from '@/features/users'
import { NAV } from '@/shared/router'

export const EditUserPage = () => {
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false }) as { userId: string }
  const { t } = useUsersTranslation()

  const { data: user, isLoading } = useUser(userId)
  const updateUser = useUpdateUser(userId)

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: NAV.users.path, replace: true })
    }
  }, [isLoading, user, navigate])

  const handleUpdate = (data: UpdateUserFormData) => {
    updateUser.mutate(data, {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: NAV.users.path })
      },
      onError: (error) => notify.queryError(error),
    })
  }

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
      <PageHeader
        title={t.page.editTitle}
        description={t.page.editDescription(userName)}
      />
      <div className="max-w-lg">
        <UserForm
          mode="edit"
          defaultValues={user}
          isSubmitting={updateUser.isPending}
          onCancel={() => navigate({ to: NAV.users.path })}
          onCreate={() => {}}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}
