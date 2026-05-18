import { Avatar, IconButton, IconComponent, Spinner } from '@/shared/ui'
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="medium" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-slate-400">
        <IconComponent icon="RiUser3Line" className="h-10 w-10" />
        <p className="text-sm">{t.table.noResults}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">{t.table.colUser}</th>
              <th className="px-4 py-3">{t.table.colEmail}</th>
              <th className="px-4 py-3">{t.table.colStatus}</th>
              <th className="px-4 py-3">{t.table.colPresence}</th>
              <th className="px-4 py-3 text-right">{t.table.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors duration-fast ease-out-expo hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      alt={`${user.firstName} ${user.lastName}`}
                      src={user.profilePictureUrl}
                      name={`${user.firstName} ${user.lastName}`}
                      size="sm"
                    />
                    <span className="font-medium text-slate-800">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.email}</td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  <PresenceDot
                    status={user.presenceStatus}
                    label={t.presence[user.presenceStatus]}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton
                      icon="RiPencilLine"
                      variant="text"
                      size="small"
                      aria-label={t.table.editUser}
                      onClick={() => onEdit(user)}
                    />
                    <IconButton
                      icon="RiDeleteBinLine"
                      variant="text"
                      size="small"
                      aria-label={t.table.deleteUser}
                      onClick={() => onDelete(user)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
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
            <span className="px-2 font-medium text-slate-700">
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

