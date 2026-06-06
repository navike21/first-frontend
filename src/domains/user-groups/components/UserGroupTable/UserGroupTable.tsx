import clsx from 'clsx'
import { IconButton, IconComponent, Spinner, Tooltip } from '@/shared/ui'
import { useUserGroupsTranslation } from '../../i18n'
import type { UserGroup } from '../../model/userGroup.types'

interface UserGroupTableProps {
  groups: UserGroup[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (group: UserGroup) => void
  onEdit: (group: UserGroup) => void
  onDelete: (group: UserGroup) => void
}

export const UserGroupTable = ({
  groups,
  isLoading,
  total,
  page,
  pages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: UserGroupTableProps) => {
  const { t } = useUserGroupsTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="medium" />
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-(--text-muted)">
        <IconComponent icon="RiGroupLine" className="h-10 w-10" />
        <p className="text-sm">{t.table.noResults}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-(--border) bg-(--surface) shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className={clsx(
              'text-left',
              'border-b border-(--border-subtle) bg-(--surface-subtle) text-xs font-semibold uppercase tracking-wide text-(--text-secondary)',
            )}>
              <th className="px-4 py-3">{t.table.colName}</th>
              <th className="px-4 py-3">{t.table.colPermissions}</th>
              <th className="px-4 py-3">{t.table.colStatus}</th>
              <th className="px-4 py-3 text-right">{t.table.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {groups.map((group) => (
              <tr
                key={group.id}
                className={clsx(
                  'transition-colors duration-fast ease-out-expo',
                  'hover:bg-(--surface-subtle)',
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-(--border)"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="font-medium text-(--text-primary)">{group.name}</span>
                    {group.isSystem && (
                      <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t.table.systemBadge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                    {t.table.permissionsCount(group.permissions.length)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      group.status === 'active'
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
                    )}
                  >
                    {t.status[group.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip heading={t.table.viewGroup} icon="RiEyeLine" position="top" size="small">
                      <IconButton
                        icon="RiEyeLine"
                        variant="text"
                        size="small"
                        aria-label={t.table.viewGroup}
                        onClick={() => onView(group)}
                      />
                    </Tooltip>
                    <Tooltip heading={t.table.editGroup} icon="RiPencilLine" position="top" size="small">
                      <IconButton
                        icon="RiPencilLine"
                        variant="text"
                        size="small"
                        aria-label={t.table.editGroup}
                        disabled={group.isSystem}
                        onClick={() => onEdit(group)}
                      />
                    </Tooltip>
                    <Tooltip heading={t.table.deleteGroup} icon="RiDeleteBinLine" position="top" size="small">
                      <IconButton
                        icon="RiDeleteBinLine"
                        variant="text"
                        size="small"
                        aria-label={t.table.deleteGroup}
                        disabled={group.isSystem}
                        onClick={() => onDelete(group)}
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-(--text-secondary)">
        <span>{t.table.totalCount(total)}</span>
        {pages > 1 && (
          <div className="flex items-center gap-1">
            <IconButton
              icon="RiArrowLeftSLine"
              variant="text"
              size="small"
              aria-label={t.table.prevPage}
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            />
            <span className="px-2 font-medium text-(--text-primary)">
              {page} / {pages}
            </span>
            <IconButton
              icon="RiArrowRightSLine"
              variant="text"
              size="small"
              aria-label={t.table.nextPage}
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
