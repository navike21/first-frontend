import { useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { IsoLogoIndra, Button } from '@/shared/ui'

export const NotFoundPage = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const { location } = useRouterState()
  const brokenPath = (location.state as { brokenPath?: string })?.brokenPath
  const canGoBack = globalThis.history.length > 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4">
      <IsoLogoIndra />

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-6xl font-bold text-slate-900">404</span>
        <h1 className="text-2xl font-semibold text-slate-800">
          Página no encontrada
        </h1>

        {brokenPath && (
          <code className="mt-1 max-w-sm rounded bg-slate-100 px-3 py-1.5 font-mono text-sm break-all text-slate-600">
            {brokenPath}
          </code>
        )}

        <p className="max-w-sm text-sm text-slate-500">
          La página que buscas no existe o fue movida. Verifica la URL o regresa
          al inicio.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {canGoBack && (
          <Button
            variant="secondary"
            icon="RiArrowLeftLine"
            onClick={() => router.history.back()}
          >
            Página anterior
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => {
            navigate({ to: '/', replace: true }).catch(() => null)
          }}
        >
          Ir al inicio
        </Button>
      </div>
    </div>
  )
}
