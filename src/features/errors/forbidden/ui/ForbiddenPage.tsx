import { IsoLogoIndra, LinkButton } from '@/shared/ui'

export const ForbiddenPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4">
      <IsoLogoIndra />
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-6xl font-bold text-slate-900">403</span>
        <h1 className="text-2xl font-semibold text-slate-800">
          Acceso restringido
        </h1>
        <p className="max-w-sm text-sm text-slate-500">
          No tienes una sesión activa para acceder a esta página. Por favor,
          inicia sesión para continuar.
        </p>
      </div>
      <LinkButton variant="primary" href="/login">
        Iniciar sesión
      </LinkButton>
    </div>
  )
}
