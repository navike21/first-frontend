import { Avatar, IconButton, Spinner } from '@/shared/ui'
import { UserStatusBadge } from '../UserStatusBadge/UserStatusBadge'
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
        <span className="text-4xl">👤</span>
        <p className="text-sm">No se encontraron usuarios</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Presencia</th>
              <th className="px-4 py-3 text-right">Acciones</th>
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
                      size="sm"
                      className="shrink-0 bg-primary-800 font-semibold text-white"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.email}</td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  <PresenceDot status={user.presenceStatus} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton
                      icon="RiPencilLine"
                      variant="text"
                      size="small"
                      aria-label="Editar usuario"
                      onClick={() => onEdit(user)}
                    />
                    <IconButton
                      icon="RiDeleteBinLine"
                      variant="text"
                      size="small"
                      aria-label="Eliminar usuario"
                      onClick={() => onDelete(user)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{total} usuario{total !== 1 ? 's' : ''} en total</span>
        {pages > 1 && (
          <div className="flex items-center gap-1">
            <IconButton
              icon="RiArrowLeftSLine"
              variant="text"
              size="small"
              aria-label="Página anterior"
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
              aria-label="Página siguiente"
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const presenceConfig = {
  available: { label: 'Disponible', color: 'bg-emerald-400' },
  busy: { label: 'Ocupado', color: 'bg-red-400' },
  away: { label: 'Ausente', color: 'bg-amber-400' },
  offline: { label: 'Desconectado', color: 'bg-slate-300' },
} as const

const PresenceDot = ({ status }: { status: User['presenceStatus'] }) => {
  const { label, color } = presenceConfig[status]
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  )
}
