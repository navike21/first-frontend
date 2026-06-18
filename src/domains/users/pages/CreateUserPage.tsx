import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageHeader } from '@/shared/ui'
import { UserForm, useCreateUser } from '..'
import { useUsersTranslation } from '../i18n'
import type { CreateUserFormData } from '..'
import { navPaths } from '@/shared/router'

export const CreateUserPage = () => {
  const navigate = useNavigate()
  const { t, language } = useUsersTranslation()
  const createUser = useCreateUser()

  const handleCreate = (data: CreateUserFormData, avatar?: File | null) => {
    createUser.mutate(
      { data, avatar },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.created)
          // 2xx with warnings = record saved but the image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.users(language) as never })
        },
        // Offline: the user is queued (without the photo). Treat it as a soft
        // success — warn the photo was skipped and go back to the list.
        onError: onQueuedOr(() => {
          if (avatar) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.users(language) as never })
        }),
      }
    )
  }

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title={t.page.createTitle}
        description={t.page.createDescription}
      />
      <div>
        <UserForm
          mode="create"
          isSubmitting={createUser.isPending}
          onCancel={() => navigate({ to: navPaths.users(language) as never })}
          onCreate={handleCreate}
          onUpdate={() => {}}
          submitError={createUser.error}
        />
      </div>
    </div>
  )
}
