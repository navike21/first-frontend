import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/no-autorizado')({
  component: ForbiddenPage,
})

function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-4xl font-bold text-slate-900">403</h1>
      <p className="text-slate-500">No tienes acceso a esta sección.</p>
      <Link to="/login" className="text-sm text-primary-950 underline hover:opacity-80">
        Ir al login
      </Link>
    </div>
  )
}
