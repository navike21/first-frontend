import {
  PageHeader,
  InputField,
  Select,
  Modal,
  Button,
  IconComponent,
} from '@/shared/ui'
import { UserTable } from '..'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { useUsersPage } from './UsersPage.hooks'

export const UsersPage = () => {
  const {
    t,
    language,
    params,
    search,
    deletingUser,
    selectedIds,
    bulkConfirmOpen,
    data,
    isLoading,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingUser,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  } = useUsersPage()

  const canSeeTrash = useHasPermission('users:purge', 'users:manage', '*:*')
  const canCreate = useHasPermission(...CAN.usersCreate)

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title={t.page.listTitle}
        description={t.page.listDescription}
        actions={[
          ...(canSeeTrash
            ? [
                {
                  type: 'link' as const,
                  label: t.actions.viewTrash,
                  variant: 'outline' as const,
                  to: navPaths.userTrash(language),
                  size: 'small' as const,
                },
              ]
            : []),
          ...(canCreate
            ? [
                {
                  type: 'link' as const,
                  label: t.actions.newUser,
                  variant: 'primary' as const,
                  to: navPaths.userCreate(language),
                  size: 'small' as const,
                },
              ]
            : []),
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <InputField
            label={t.filters.searchLabel}
            placeholder={t.filters.searchPlaceholder}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftSlot={
              <span className="px-3 text-(--text-muted)">
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

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-(--border) bg-(--surface-subtle) px-4 py-2">
          <span className="text-sm font-medium text-(--text-primary)">
            {t.actions.selectedCount(selectedIds.length)}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="small" onClick={clearSelection}>
              {t.actions.clearSelection}
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => setBulkConfirmOpen(true)}
            >
              {t.actions.bulkDeactivate}
            </Button>
          </div>
        </div>
      )}

      <UserTable
        users={data?.items ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={data?.page ?? 1}
        pages={data?.pages ?? 1}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        size="sm"
        title={t.actions.deactivateTitle}
        description={
          deletingUser
            ? t.actions.deactivateDescription(
                deletingUser.firstName,
                deletingUser.lastName
              )
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingUser(null)}
              disabled={softDelete.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={softDelete.isPending}
              onClick={handleConfirmDelete}
            >
              {t.actions.confirmDeactivate}
            </Button>
          </>
        }
      />

      <Modal
        isOpen={bulkConfirmOpen}
        onClose={() => setBulkConfirmOpen(false)}
        size="sm"
        title={t.actions.deactivateTitle}
        description={t.actions.bulkDeactivateDescription(selectedIds.length)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setBulkConfirmOpen(false)}
              disabled={bulkSoftDelete.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={bulkSoftDelete.isPending}
              onClick={handleConfirmBulkDelete}
            >
              {t.actions.confirmDeactivate}
            </Button>
          </>
        }
      />
    </div>
  )
}
