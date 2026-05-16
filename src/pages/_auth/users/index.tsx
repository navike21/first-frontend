import { createFileRoute } from '@tanstack/react-router'
import { useUsers, UserAvatar, UserStatusBadge } from '@features/users'
import type { User } from '@features/users'
import { Spinner } from '@shared/ui'

export const Route = createFileRoute('/_auth/users/')({
  component: UsersPage,
})

function UsersPage() {
  const { data, isLoading } = useUsers()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="large" />
        </div>
      )}
      {data && (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Usuario</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items.map((user: User) => (
                <tr key={user.id} className="bg-white hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="sm" />
                      <span className="font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <UserStatusBadge status={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
