import {
  PageContent,
  InputField,
  Select,
  Modal,
  Button,
  IconComponent,
} from '@/shared/ui'
import { UserGroupTable, UserGroupDetailModal } from '..'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { useUserGroupsPage } from './UserGroupsPage.hooks'

export const UserGroupsPage = () => {
  const {
    t,
    language,
    params,
    search,
    viewingGroup,
    deletingGroup,
    data,
    isLoading,
    softDelete,
    statusOptions,
    handleView,
    handleEdit,
    handleManageUsers,
    handleDelete,
    handleConfirmDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setViewingGroup,
    setDeletingGroup,
  } = useUserGroupsPage()

  const canSeeTrash = useHasPermission(
    'user-groups:purge',
    'user-groups:manage',
    '*:*'
  )
  const canCreate = useHasPermission(...CAN.groupsCreate)

  return (
    <PageContent
      title={t.page.listTitle}
      description={t.page.listDescription}
      actions={[
        ...(canSeeTrash
          ? [
              {
                type: 'link' as const,
                label: t.actions.viewTrash,
                variant: 'outline' as const,
                to: navPaths.userGroupTrash(language),
                size: 'small' as const,
              },
            ]
          : []),
        ...(canCreate
          ? [
              {
                type: 'link' as const,
                label: t.actions.newGroup,
                variant: 'primary' as const,
                to: navPaths.userGroupCreate(language),
                size: 'small' as const,
              },
            ]
          : []),
      ]}
    >

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <InputField
            label={t.filters.searchLabel}
            placeholder={t.filters.searchPlaceholder}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftSlot={
              <span className="px-3 text-muted">
                <IconComponent icon="RiSearchLine" className="h-4 w-4" />
              </span>
            }
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            label={t.filters.statusLabel}
            options={statusOptions}
            value={params.status ?? 'all'}
            lang={language}
            onChange={(e) => handleStatusChange(e.target.value)}
          />
        </div>
      </div>

      <UserGroupTable
        groups={data?.items ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={data?.page ?? 1}
        pages={data?.pages ?? 1}
        onPageChange={handlePageChange}
        onView={handleView}
        onEdit={handleEdit}
        onManageUsers={handleManageUsers}
        onDelete={handleDelete}
      />

      <UserGroupDetailModal
        group={viewingGroup}
        onClose={() => setViewingGroup(null)}
        onEdit={(group) => {
          setViewingGroup(null)
          handleEdit(group)
        }}
      />

      <Modal
        isOpen={!!deletingGroup}
        onClose={() => setDeletingGroup(null)}
        size="sm"
        title={t.actions.deleteTitle}
        description={
          deletingGroup
            ? t.actions.deleteDescription(deletingGroup.name)
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingGroup(null)}
              disabled={softDelete.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={softDelete.isPending}
              onClick={handleConfirmDelete}
            >
              {t.actions.confirmDelete}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
