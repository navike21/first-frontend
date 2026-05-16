import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Sidebar } from '@features/layout/Sidebar'
import { Header } from '@features/layout/Header'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (!(context as Record<string, unknown>).isAuthenticated) {
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex h-screen bg-[--color-background] overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
