import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/user-groups/')({
  component: UserGroupsPage,
})

function UserGroupsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">User Groups</h1>
      <p className="text-[--color-muted] mt-2">Módulo en construcción.</p>
    </div>
  )
}
