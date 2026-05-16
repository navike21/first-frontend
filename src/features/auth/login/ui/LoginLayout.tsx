import { LoginForm } from './LoginForm'

export const LoginLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="w-full max-w-sm px-6 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-bold text-xl text-white">
          F
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">First</h1>
        <p className="mt-1 text-sm text-slate-500">Gestor navike21</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-base font-semibold text-slate-800">Iniciar sesión</h2>
        <LoginForm />
      </div>
    </div>
  </div>
)
