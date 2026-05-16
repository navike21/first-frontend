import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@features/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if ((context as Record<string, unknown>).isAuthenticated) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
      <div className="w-full max-w-md px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[--color-foreground] tracking-tight">First</h1>
          <p className="mt-1 text-sm text-[--color-muted]">Gestor navike21</p>
        </div>
        <div className="rounded-[--radius-xl] border border-[--color-border] bg-[--color-card] p-8 shadow-[--shadow-md]">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
