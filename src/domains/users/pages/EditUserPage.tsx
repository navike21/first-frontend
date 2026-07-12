import { useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { UserForm, useUser, useUpdateUser } from '..'
import { useUsersTranslation } from '../i18n'
import type { UpdateUserFormData } from '..'
import { navPaths } from '@/shared/router'

export const EditUserPage = () => {
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false }) as { userId: string }
  const { t, language } = useUsersTranslation()

  const { data: user, isLoading } = useUser(userId)
  const updateUser = useUpdateUser(userId)

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: navPaths.users(language) as never, replace: true })
    }
  }, [isLoading, user, navigate, language])

  const handleUpdate = (
    data: UpdateUserFormData,
    avatar?: File | null,
    removeAvatar?: boolean,
    avatarLibraryUrl?: string
  ) => {
    updateUser.mutate(
      { data, avatar, removeAvatar, avatarLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.updated)
          // 2xx with warnings = record saved but the image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.users(language) as never })
        },
        // Offline: the edit is queued (without the photo). Soft success — warn
        // the photo was skipped and go back to the list.
        onError: onQueuedOr(() => {
          if (avatar) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.users(language) as never })
        }),
      }
    )
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
    <PageContent
      title={t.page.editTitle}
      description={t.page.editDescription(userName)}
    >
      <div>
        <UserForm
          mode="edit"
          defaultValues={user}
          isSubmitting={updateUser.isPending}
          onCancel={() => navigate({ to: navPaths.users(language) as never })}
          onCreate={() => {}}
          onUpdate={handleUpdate}
          submitError={updateUser.error}
        />
      </div>
    </PageContent>
  )
}
