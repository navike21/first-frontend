import {
  PageContent,
  Modal,
  Button, ButtonGroup,
  IconButton,
  Tooltip,
  Avatar,
  DataTable,
  FadeCollapse,
  type DataTableColumn,
} from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { UserDetailModal } from '../components/UserDetailModal/UserDetailModal'
import { useUsersTrashPage } from './UsersTrashPage.hooks'
import type { User } from '..'

export const UsersTrashPage = () => {
  const {
    t,
    language,
    page,
    data,
    isLoading,
    restoringUser,
    purgingUser,
    viewingUser,
    selectedIds,
    bulkRestoreOpen,
    bulkPurgeOpen,
    canRestore,
    canPurge,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    setRestoringUser,
    setPurgingUser,
    setViewingUser,
    setSelectedIds,
    setBulkRestoreOpen,
    setBulkPurgeOpen,
    handlePageChange,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulkRestore,
    handleConfirmBulkPurge,
  } = useUsersTrashPage()

  const users = data?.items ?? []
  const total = data?.total ?? 0
  const pages = data?.pages ?? 1

  const columns: DataTableColumn<User>[] = [
    {
      id: 'user',
      header: t.table.colUser,
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={`${user.firstName} ${user.lastName}`}
            src={user.profilePictureUrl}
            name={`${user.firstName} ${user.lastName}`}
            size="sm"
          />
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
        </div>
      ),
    },
    {
      id: 'email',
      header: t.table.colEmail,
      cellClassName: 'text-secondary',
      cell: (user) => user.email,
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (user) =>
        user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : '—',
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (user) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.actions.viewDetail} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.actions.viewDetail}
              onClick={() => setViewingUser(user)}
            />
          </Tooltip>
          {canRestore && (
            <Tooltip
              heading={t.actions.restoreUser}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.actions.restoreUser}
                onClick={() => setRestoringUser(user)}
              />
            </Tooltip>
          )}
          {canPurge && (
            <Tooltip
              heading={t.actions.purgeUser}
              subtitle={t.actions.purgeWarning}
              position="top"
              size="medium"
            >
              <IconButton
                icon="RiDeleteBin2Line"
                variant="text"
                size="small"
                aria-label={t.actions.purgeUser}
                onClick={() => setPurgingUser(user)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  return (
    <PageContent
      title={t.page.trashTitle}
      description={t.page.trashDescription}
      actions={[
        {
          type: 'link',
          label: t.actions.cancel,
          variant: 'secondary',
          to: navPaths.users(language),
          size: 'small',
        },
      ]}
    >

      <div>
        <FadeCollapse show={selectedIds.length > 0 && (canRestore || canPurge)}>
          <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-4 py-2">
            <span className="text-sm font-medium text-foreground">
              {t.actions.selectedCount(selectedIds.length)}
            </span>
            <ButtonGroup>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setSelectedIds([])}
              >
                {t.actions.clearSelection}
              </Button>
              {canRestore && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setBulkRestoreOpen(true)}
                >
                  {t.actions.bulkRestore}
                </Button>
              )}
              {canPurge && (
                <Button
                  variant="destructive"
                  size="small"
                  onClick={() => setBulkPurgeOpen(true)}
                >
                  {t.actions.bulkPurge}
                </Button>
              )}
            </ButtonGroup>
          </div>
        </FadeCollapse>

        <DataTable
          columns={columns}
          rows={users}
          getRowKey={(user) => user.id}
          isLoading={isLoading}
          emptyIcon="RiDeleteBinLine"
          emptyLabel={t.page.trashEmpty}
          totalLabel={t.table.totalCount(total)}
          pagination={{
            page,
            pages,
            onPageChange: handlePageChange,
            prevLabel: t.table.prevPage,
            nextLabel: t.table.nextPage,
          }}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          selectAllLabel={t.table.selectAll}
          selectRowLabel={t.table.selectRow}
        />
      </div>

      <UserDetailModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        canRestore={canRestore}
        canPurge={canPurge}
        onRestore={() => {
          setRestoringUser(viewingUser)
          setViewingUser(null)
        }}
        onPurge={() => {
          setPurgingUser(viewingUser)
          setViewingUser(null)
        }}
      />

      {/* Restore confirmation */}
      <Modal
        isOpen={!!restoringUser}
        onClose={() => setRestoringUser(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoringUser
            ? t.actions.restoreDescription(
                `${restoringUser.firstName} ${restoringUser.lastName}`
              )
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRestoringUser(null)}
              disabled={restore.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={restore.isPending}
              onClick={handleConfirmRestore}
            >
              {t.actions.confirmRestore}
            </Button>
          </>
        }
      />

      {/* Purge confirmation */}
      <Modal
        isOpen={!!purgingUser}
        onClose={() => setPurgingUser(null)}
        size="sm"
        title={t.actions.purgeTitle}
        description={
          purgingUser
            ? t.actions.purgeDescription(
                `${purgingUser.firstName} ${purgingUser.lastName}`
              )
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setPurgingUser(null)}
              disabled={purge.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="destructive"
              loading={purge.isPending}
              onClick={handleConfirmPurge}
            >
              {t.actions.confirmPurge}
            </Button>
          </>
        }
      />

      {/* Bulk restore confirmation */}
      <Modal
        isOpen={bulkRestoreOpen}
        onClose={() => setBulkRestoreOpen(false)}
        size="sm"
        title={t.actions.restoreTitle}
        description={t.actions.bulkRestoreDescription(selectedIds.length)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setBulkRestoreOpen(false)}
              disabled={bulkRestore.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={bulkRestore.isPending}
              onClick={handleConfirmBulkRestore}
            >
              {t.actions.confirmRestore}
            </Button>
          </>
        }
      />

      {/* Bulk purge confirmation */}
      <Modal
        isOpen={bulkPurgeOpen}
        onClose={() => setBulkPurgeOpen(false)}
        size="sm"
        title={t.actions.purgeTitle}
        description={t.actions.bulkPurgeDescription(selectedIds.length)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setBulkPurgeOpen(false)}
              disabled={bulkPurge.isPending}
            >
              {t.actions.cancel}
            </Button>
            <Button
              variant="destructive"
              loading={bulkPurge.isPending}
              onClick={handleConfirmBulkPurge}
            >
              {t.actions.confirmPurge}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
