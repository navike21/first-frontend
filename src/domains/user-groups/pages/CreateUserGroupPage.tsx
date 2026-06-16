import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader } from '@/shared/ui'
import { UserGroupForm, useCreateUserGroup } from '..'
import { useUserGroupsTranslation } from '../i18n'
import type { CreateUserGroupFormData } from '..'
import { navPaths } from '@/shared/router'

export const CreateUserGroupPage = () => {
  const navigate = useNavigate()
  const { t, language } = useUserGroupsTranslation()
  const createUserGroup = useCreateUserGroup()

  const handleCreate = (data: CreateUserGroupFormData) => {
    createUserGroup.mutate(data, {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.userGroups(language) as never })
      },
      onError: (error) => notify.queryError(error),
    })
  }

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title={t.page.createTitle}
        description={t.page.createDescription}
      />
      <div>
        <UserGroupForm
          mode="create"
          isSubmitting={createUserGroup.isPending}
          onCancel={() =>
            navigate({ to: navPaths.userGroups(language) as never })
          }
          onCreate={handleCreate}
          onUpdate={() => {}}
          submitError={createUserGroup.error}
        />
      </div>
    </div>
  )
}
