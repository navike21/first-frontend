import clsx from 'clsx'
import {
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
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

  const columns: DataTableColumn<UserGroup>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (group) => (
        <div className="flex items-center gap-3">
          <span
            className="h-4 w-4 shrink-0 rounded-full border border-(--border)"
            style={{ backgroundColor: group.color }}
          />
          <span className="font-medium text-(--text-primary)">
            {group.name}
          </span>
          {group.isSystem && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
              {t.table.systemBadge}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'permissions',
      header: t.table.colPermissions,
      cell: (group) => (
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {t.table.permissionsCount(group.permissions.length)}
        </span>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (group) => (
        <span
          className={clsx(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            group.status === 'active'
              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
          )}
        >
          {t.status[group.status]}
        </span>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (group) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip
            heading={t.table.viewGroup}
            icon="RiEyeLine"
            position="top"
            size="small"
          >
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewGroup}
              onClick={() => onView(group)}
            />
          </Tooltip>
          <Tooltip
            heading={t.table.editGroup}
            icon="RiPencilLine"
            position="top"
            size="small"
          >
            <IconButton
              icon="RiPencilLine"
              variant="text"
              size="small"
              aria-label={t.table.editGroup}
              disabled={group.isSystem}
              onClick={() => onEdit(group)}
            />
          </Tooltip>
          <Tooltip
            heading={t.table.deleteGroup}
            icon="RiDeleteBinLine"
            position="top"
            size="small"
          >
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
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={groups}
      getRowKey={(group) => group.id}
      isLoading={isLoading}
      emptyIcon="RiGroupLine"
      emptyLabel={t.table.noResults}
      totalLabel={t.table.totalCount(total)}
      pagination={{
        page,
        pages,
        onPageChange,
        prevLabel: t.table.prevPage,
        nextLabel: t.table.nextPage,
      }}
    />
  )
}
