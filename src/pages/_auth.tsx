import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAuth } from '@shared/router'
import { Sidebar } from '@features/layout/Sidebar'
import { Header } from '@features/layout/Header'

export const Route = createFileRoute('/_auth')({
  beforeLoad: requireAuth,
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
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
