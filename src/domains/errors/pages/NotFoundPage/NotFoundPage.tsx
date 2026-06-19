import { Button, LanguageSwitcher } from '@/shared/ui'
import { useNotFoundPage } from './NotFoundPage.hooks'

export const NotFoundPage = () => {
  const { t, brokenPath, canGoBack, isAuthenticated, handleBack, handleHome } =
    useNotFoundPage()

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 bg-(--surface) px-4 py-6">
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <span className="text-2xl font-bold tracking-tight text-(--text-primary)">
        First
      </span>

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-6xl font-bold text-(--text-primary)">404</span>
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          {t.notFound.heading}
        </h1>

        {brokenPath && (
          <code className="mt-1 max-w-sm rounded bg-(--surface-subtle) px-3 py-1.5 font-mono text-sm break-all text-(--text-secondary)">
            {brokenPath}
          </code>
        )}

        <p className="max-w-sm text-sm text-(--text-secondary)">
          {t.notFound.message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {canGoBack && (
          <Button
            variant="secondary"
            onClick={handleBack}
          >
            {t.notFound.backButton}
          </Button>
        )}
        <Button variant="primary" onClick={handleHome}>
          {isAuthenticated ? t.notFound.homeButton : t.notFound.loginButton}
        </Button>
      </div>
    </div>
  )
}
