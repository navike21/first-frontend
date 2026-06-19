import {
  Chip,
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
  onManageUsers: (group: UserGroup) => void
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
  onManageUsers,
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
            <Chip variant="default" size="small">
              {t.table.systemBadge}
            </Chip>
          )}
        </div>
      ),
    },
    {
      id: 'permissions',
      header: t.table.colPermissions,
      cell: (group) => (
        <Chip variant="informative" size="small">
          {t.table.permissionsCount(group.permissions.length)}
        </Chip>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (group) => (
        <Chip
          variant={group.status === 'active' ? 'success' : 'default'}
          size="small"
        >
          {t.status[group.status]}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (group) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip
            heading={t.table.manageUsers}
            position="top"
            size="small"
          >
            <IconButton
              icon="RiUserSettingsLine"
              variant="text"
              size="small"
              aria-label={t.table.manageUsers}
              onClick={() => onManageUsers(group)}
            />
          </Tooltip>
          <Tooltip
            heading={t.table.viewGroup}
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
