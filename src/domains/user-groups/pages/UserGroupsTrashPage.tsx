import {
  PageContent,
  Modal,
  Button,
  IconButton,
  Tooltip,
  DataTable,
  type DataTableColumn,
} from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useUserGroupsTrashPage } from './UserGroupsTrashPage.hooks'
import type { UserGroup } from '..'

export const UserGroupsTrashPage = () => {
  const {
    t,
    language,
    page,
    data,
    isLoading,
    isFetching,
    restoringGroup,
    purgingGroup,
    canRestore,
    canPurge,
    restore,
    purge,
    setPage,
    setRestoringGroup,
    setPurgingGroup,
    handleConfirmRestore,
    handleConfirmPurge,
  } = useUserGroupsTrashPage()

  const groups = data?.items ?? []
  const total = data?.total ?? 0
  const pages = data?.pages ?? 1

  const columns: DataTableColumn<UserGroup>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (group) => (
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
            style={{ backgroundColor: group.color }}
          />
          <span className="text-foreground font-medium">{group.name}</span>
        </div>
      ),
    },
    {
      id: 'permissions',
      header: t.table.colPermissions,
      cellClassName: 'text-secondary',
      cell: (group) => t.table.permissionsCount(group.permissions.length),
    },
    {
      id: 'deletedAt',
      header: t.table.deletedAt,
      cellClassName: 'text-secondary',
      cell: (group) =>
        group.deletedAt ? new Date(group.deletedAt).toLocaleDateString() : '—',
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (group) => (
        <div className="flex items-center justify-end gap-1">
          {canRestore && (
            <Tooltip
              heading={t.actions.restoreGroup}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiArrowGoBackLine"
                variant="text"
                size="small"
                aria-label={t.actions.restoreGroup}
                onClick={() => setRestoringGroup(group)}
              />
            </Tooltip>
          )}
          {canPurge && (
            <Tooltip
              heading={t.actions.purgeGroup}
              subtitle={t.actions.purgeWarning}
              position="top"
              size="medium"
            >
              <IconButton
                icon="RiDeleteBin2Line"
                variant="text"
                size="small"
                aria-label={t.actions.purgeGroup}
                onClick={() => setPurgingGroup(group)}
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
          to: navPaths.userGroups(language),
          size: 'small',
        },
      ]}
    >
      <DataTable
        columns={columns}
        rows={groups}
        getRowKey={(group) => group.id}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyIcon="RiDeleteBinLine"
        emptyLabel={t.page.trashEmpty}
        totalLabel={t.table.totalCount(total)}
        pagination={{
          page,
          pages,
          onPageChange: setPage,
          prevLabel: t.table.prevPage,
          nextLabel: t.table.nextPage,
        }}
      />

      {/* Restore confirmation modal */}
      <Modal
        isOpen={!!restoringGroup}
        onClose={() => setRestoringGroup(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoringGroup
            ? t.actions.restoreDescription(restoringGroup.name)
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRestoringGroup(null)}
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

      {/* Purge confirmation modal */}
      <Modal
        isOpen={!!purgingGroup}
        onClose={() => setPurgingGroup(null)}
        size="sm"
        title={t.actions.purgeTitle}
        description={
          purgingGroup
            ? t.actions.purgeDescription(purgingGroup.name)
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setPurgingGroup(null)}
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
    </PageContent>
  )
}
