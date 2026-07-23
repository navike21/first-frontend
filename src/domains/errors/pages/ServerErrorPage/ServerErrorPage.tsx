import { Button, LanguageSwitcher, BrandMark } from '@/shared/ui'
import { useErrorTranslation } from '../../i18n'

/**
 * Sin props: se usa navegado directo (su propia ruta por idioma) Y como
 * `defaultErrorComponent` del router (que le pasaría {error, info, reset} —
 * los ignora deliberadamente, un reload cubre ambos casos por igual).
 */
export const ServerErrorPage = () => {
  const { t } = useErrorTranslation()

  return (
    <div className="bg-surface relative flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-6">
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <BrandMark size="small" animateIn />
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-display text-foreground text-6xl font-bold">
          500
        </span>
        <h1 className="text-foreground text-2xl font-semibold">
          {t.serverError.heading}
        </h1>
        <p className="text-secondary max-w-sm text-sm">
          {t.serverError.message}
        </p>
      </div>
      <Button variant="primary" onClick={() => window.location.reload()}>
        {t.serverError.retryButton}
      </Button>
    </div>
  )
}
