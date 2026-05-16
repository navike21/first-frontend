import { createFileRoute } from '@tanstack/react-router'
import { requireGuest } from '@shared/router'
import { LoginForm } from '@features/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: requireGuest,
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm px-6 py-10">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-950 text-white font-bold text-xl">
            F
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">First</h1>
          <p className="mt-1 text-sm text-slate-500">Gestor navike21</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-base font-semibold text-slate-800">Iniciar sesión</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
