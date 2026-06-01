import { PageHeader, Modal, Button, IconButton, IconComponent, Tooltip } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useUserGroupsTrashPage } from './UserGroupsTrashPage.hooks'

export const UserGroupsTrashPage = () => {
  const {
    t,
    language,
    page,
    data,
    isLoading,
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

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader
        title={t.page.trashTitle}
        description={t.page.trashDescription}
        actions={[
          {
            type: 'link',
            label: t.actions.cancel,
            icon: 'RiArrowLeftLine',
            variant: 'secondary',
            to: navPaths.userGroups(language),
            size: 'small',
          },
        ]}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
          <IconComponent icon="RiDeleteBinLine" className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-lg font-semibold text-slate-700">{t.page.trashEmpty}</p>
          <p className="mt-1 text-sm text-slate-400">{t.page.trashEmptyDescription}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">{t.table.colName}</th>
                <th className="px-4 py-3 text-left">{t.table.colPermissions}</th>
                <th className="px-4 py-3 text-left">{t.table.deletedAt}</th>
                <th className="px-4 py-3 text-right">{t.table.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="font-medium text-slate-900">{group.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {t.table.permissionsCount(group.permissions.length)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {group.deletedAt
                      ? new Date(group.deletedAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {canRestore && (
                        <Tooltip heading={t.actions.restoreGroup} icon="RiArrowGoBackLine" position="top" size="small">
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
                          icon="RiDeleteBin2Line"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <span className="text-sm text-slate-500">
                {t.table.totalCount(total)}
              </span>
              <div className="flex items-center gap-1">
                <IconButton
                  icon="RiArrowLeftSLine"
                  variant="text"
                  size="small"
                  aria-label={t.table.prevPage}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                />
                <span className="text-sm text-slate-500">{page} / {pages}</span>
                <IconButton
                  icon="RiArrowRightSLine"
                  variant="text"
                  size="small"
                  aria-label={t.table.nextPage}
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                />
              </div>
            </div>
          )}
        </div>
      )}

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
              variant="error"
              loading={purge.isPending}
              onClick={handleConfirmPurge}
            >
              {t.actions.confirmPurge}
            </Button>
          </>
        }
      />
    </div>
  )
}
