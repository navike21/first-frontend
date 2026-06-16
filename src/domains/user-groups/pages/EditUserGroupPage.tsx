import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { PageHeader, Spinner, Tabs } from '@/shared/ui'
import { UserGroupForm, useUserGroup, useUpdateUserGroup } from '..'
import { GroupMembers } from '../components/GroupMembers/GroupMembers'
import { useUserGroupsTranslation } from '../i18n'
import type { UpdateUserGroupFormData } from '..'
import { navPaths } from '@/shared/router'

export const EditUserGroupPage = () => {
  const navigate = useNavigate()
  const { groupId } = useParams({ strict: false }) as { groupId: string }
  const { t, language } = useUserGroupsTranslation()

  const { data: group, isLoading } = useUserGroup(groupId)
  const updateUserGroup = useUpdateUserGroup(groupId)
  const [activeTab, setActiveTab] = useState<'settings' | 'members'>('settings')

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

      <Tabs
        tabs={[
          { id: 'settings', label: t.tabs.settings, icon: 'RiSettings3Line' },
          { id: 'members', label: t.tabs.members, icon: 'RiGroupLine' },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as 'settings' | 'members')}
        ariaLabel={t.page.editTitle}
      />

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'settings' ? (
          <UserGroupForm
            mode="edit"
            defaultValues={group}
            isSubmitting={updateUserGroup.isPending}
            onCancel={() =>
              navigate({ to: navPaths.userGroups(language) as never })
            }
            onCreate={() => {}}
            onUpdate={handleUpdate}
            submitError={updateUserGroup.error}
          />
        ) : (
          <GroupMembers groupId={groupId} />
        )}
      </div>
    </div>
  )
}
