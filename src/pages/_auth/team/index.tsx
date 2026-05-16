import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/team/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/team/"!</div>
}
