import { useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader, Spinner } from '@/shared/ui'
import { UserGroupForm, useUserGroup, useUpdateUserGroup } from '..'
import { useUserGroupsTranslation } from '../i18n'
import type { UpdateUserGroupFormData } from '..'
import { navPaths } from '@/shared/router'

export const EditUserGroupPage = () => {
  const navigate = useNavigate()
  const { groupId } = useParams({ strict: false }) as { groupId: string }
  const { t, language } = useUserGroupsTranslation()

  const { data: group, isLoading } = useUserGroup(groupId)
  const updateUserGroup = useUpdateUserGroup(groupId)

  useEffect(() => {
    if (!isLoading && !group) {
      navigate({ to: navPaths.userGroups(language) as never, replace: true })
    }
  }, [isLoading, group, navigate, language])

  const handleUpdate = (data: UpdateUserGroupFormData) => {
    updateUserGroup.mutate(data, {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.userGroups(language) as never })
      },
      onError: (error) => notify.queryError(error),
    })
  }

  if (isLoading || !group) {
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner size="medium" />
      </div>
    )
  }

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title={t.page.editTitle}
        description={t.page.editDescription(group.name)}
      />
      <div>
        <UserGroupForm
          mode="edit"
          defaultValues={group}
          isSubmitting={updateUserGroup.isPending}
          onCancel={() =>
            navigate({ to: navPaths.userGroups(language) as never })
          }
          onCreate={() => {}}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}
