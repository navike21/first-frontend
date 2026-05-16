import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    // Redirect authenticated users to dashboard
    if ((context as Record<string, unknown>).isAuthenticated) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">First</h1>
        {/* LoginForm will be implemented in features/auth */}
        <p className="text-center text-[--color-muted]">Login form coming soon…</p>
      </div>
    </div>
  )
}
