import {
  Avatar,
  Can,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useUsersTranslation } from '../../i18n'
import { UserStatusBadge } from '../UserStatusBadge/UserStatusBadge'
import { PresenceDot } from './PresenceDot'
import type { User } from '../../model/user.types'

interface UserTableProps {
  users: User[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const UserTable = ({
  users,
  isLoading,
  isFetching,
  total,
  page,
  pages,
  onPageChange,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: UserTableProps) => {
  const { t } = useUsersTranslation()

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
          <span className="text-foreground font-medium">
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
      id: 'status',
      header: t.table.colStatus,
      cell: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      id: 'presence',
      header: t.table.colPresence,
      cell: (user) => (
        <PresenceDot
          status={user.presenceStatus}
          label={t.presence[user.presenceStatus]}
        />
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (user) => (
        <div className="flex items-center justify-end gap-1">
          <Can anyOf={CAN.usersUpdate}>
            <Tooltip heading={t.table.editUser} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editUser}
                onClick={() => onEdit(user)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.usersDelete}>
            <Tooltip heading={t.table.deleteUser} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteUser}
                onClick={() => onDelete(user)}
              />
            </Tooltip>
          </Can>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={users}
      getRowKey={(user) => user.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiUser3Line"
      emptyLabel={t.table.noResults}
      totalLabel={t.table.totalCount(total)}
      pagination={{
        page,
        pages,
        onPageChange,
        prevLabel: t.table.prevPage,
        nextLabel: t.table.nextPage,
      }}
      selectable={!!onSelectionChange}
      {...(selectedIds !== undefined && { selectedIds })}
      {...(onSelectionChange !== undefined && { onSelectionChange })}
      selectAllLabel={t.table.selectAll}
      selectRowLabel={t.table.selectRow}
    />
  )
}
