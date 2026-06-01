import { PageHeader, Modal, Button, IconButton, IconComponent, Tooltip } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useUsersTrashPage } from './UsersTrashPage.hooks'

export const UsersTrashPage = () => {
  const {
    t,
    language,
    page,
    data,
    isLoading,
    restoringUser,
    purgingUser,
    canRestore,
    canPurge,
    restore,
    purge,
    setPage,
    setRestoringUser,
    setPurgingUser,
    handleConfirmRestore,
    handleConfirmPurge,
  } = useUsersTrashPage()

  const users = data?.items ?? []
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
            to: navPaths.users(language),
            size: 'small',
          },
        ]}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        </div>
      ) : users.length === 0 ? (
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
                <th className="px-4 py-3 text-left">{t.table.colUser}</th>
                <th className="px-4 py-3 text-left">{t.table.colEmail}</th>
                <th className="px-4 py-3 text-left">{t.table.deletedAt}</th>
                <th className="px-4 py-3 text-right">{t.table.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.profilePictureUrl ? (
                        <img
                          src={user.profilePictureUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                      )}
                      <span className="font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.deletedAt
                      ? new Date(user.deletedAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {canRestore && (
                        <Tooltip heading={t.actions.restoreUser} icon="RiArrowGoBackLine" position="top" size="small">
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
                          icon="RiDeleteBin2Line"
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
        isOpen={!!restoringUser}
        onClose={() => setRestoringUser(null)}
        size="sm"
        title={t.actions.restoreTitle}
        description={
          restoringUser
            ? t.actions.restoreDescription(`${restoringUser.firstName} ${restoringUser.lastName}`)
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

      {/* Purge confirmation modal */}
      <Modal
        isOpen={!!purgingUser}
        onClose={() => setPurgingUser(null)}
        size="sm"
        title={t.actions.purgeTitle}
        description={
          purgingUser
            ? t.actions.purgeDescription(`${purgingUser.firstName} ${purgingUser.lastName}`)
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
