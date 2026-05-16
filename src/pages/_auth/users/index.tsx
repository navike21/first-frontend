import { createFileRoute } from '@tanstack/react-router'
import { useUsers, UserAvatar, UserStatusBadge } from '@features/users'
import type { User } from '@features/users'
import { Spinner } from '@shared/ui/Spinner'

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
          <Spinner size="lg" />
        </div>
      )}
      {data && (
        <div className="rounded-[--radius-lg] border border-[--color-border] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[--color-card] border-b border-[--color-border]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[--color-muted]">Usuario</th>
                <th className="px-4 py-3 text-left font-medium text-[--color-muted]">Email</th>
                <th className="px-4 py-3 text-left font-medium text-[--color-muted]">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--color-border]">
              {data.items.map((user: User) => (
                <tr key={user.id} className="bg-[--color-background] hover:bg-[--color-card]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="sm" />
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[--color-muted]">{user.email}</td>
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
