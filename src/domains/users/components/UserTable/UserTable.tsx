import {
  Avatar,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { useUsersTranslation } from '../../i18n'
import { UserStatusBadge } from '../UserStatusBadge/UserStatusBadge'
import { PresenceDot } from './PresenceDot'
import type { User } from '../../model/user.types'

interface UserTableProps {
  users: User[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export const UserTable = ({
  users,
  isLoading,
  total,
  page,
  pages,
  onPageChange,
  onEdit,
  onDelete,
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
          <span className="font-medium text-(--text-primary)">
            {user.firstName} {user.lastName}
          </span>
        </div>
      ),
    },
    {
      id: 'email',
      header: t.table.colEmail,
      cellClassName: 'text-(--text-secondary)',
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
          <Tooltip
            heading={t.table.editUser}
            icon="RiPencilLine"
            position="top"
            size="small"
          >
            <IconButton
              icon="RiPencilLine"
              variant="text"
              size="small"
              aria-label={t.table.editUser}
              onClick={() => onEdit(user)}
            />
          </Tooltip>
          <Tooltip
            heading={t.table.deleteUser}
            icon="RiDeleteBinLine"
            position="top"
            size="small"
          >
            <IconButton
              icon="RiDeleteBinLine"
              variant="text"
              size="small"
              aria-label={t.table.deleteUser}
              onClick={() => onDelete(user)}
            />
          </Tooltip>
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
    />
  )
}
