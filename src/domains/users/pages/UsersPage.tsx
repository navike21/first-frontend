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
import { useHasPermission } from '@/shared/lib/permissions'
import { useUsersPage } from './UsersPage.hooks'

export const UsersPage = () => {
  const {
    t,
    language,
    params,
    search,
    deletingUser,
    data,
    isLoading,
    softDelete,
    statusOptions,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingUser,
  } = useUsersPage()

  const canSeeTrash = useHasPermission('users:purge', 'users:manage', '*:*')

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
                  icon: 'RiDeleteBinLine' as const,
                  variant: 'secondary' as const,
                  to: navPaths.userTrash(language),
                  size: 'small' as const,
                },
              ]
            : []),
          {
            type: 'link' as const,
            label: t.actions.newUser,
            icon: 'RiUserAddLine' as const,
            variant: 'primary' as const,
            to: navPaths.userCreate(language),
            size: 'small' as const,
          },
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
              <span className="px-3 text-slate-400">
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

      <UserTable
        users={data?.items ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={data?.page ?? 1}
        pages={data?.pages ?? 1}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
              variant="error"
              loading={softDelete.isPending}
              onClick={handleConfirmDelete}
            >
              {t.actions.confirmDeactivate}
            </Button>
          </>
        }
      />
    </div>
  )
}
