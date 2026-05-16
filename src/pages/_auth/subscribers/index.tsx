import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/subscribers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/subscribers/"!</div>
}
