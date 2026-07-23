import { Button, LanguageSwitcher, BrandMark } from '@/shared/ui'
import { useNotFoundPage } from './NotFoundPage.hooks'

export const NotFoundPage = () => {
  const { t, brokenPath, canGoBack, isAuthenticated, handleBack, handleHome } =
    useNotFoundPage()

  return (
    <div className="bg-surface relative flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-6">
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <BrandMark size="small" animateIn />

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-display text-foreground text-6xl font-bold">
          404
        </span>
        <h1 className="text-foreground text-2xl font-semibold">
          {t.notFound.heading}
        </h1>

        {brokenPath && (
          <code className="bg-surface-subtle text-secondary mt-1 max-w-sm rounded px-3 py-1.5 font-mono text-sm break-all">
            {brokenPath}
          </code>
        )}

        <p className="text-secondary max-w-sm text-sm">{t.notFound.message}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {canGoBack && (
          <Button variant="secondary" onClick={handleBack}>
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
