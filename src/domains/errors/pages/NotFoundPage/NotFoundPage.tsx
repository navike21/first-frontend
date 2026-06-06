import { AppLogo, Button, LanguageSwitcher } from '@/shared/ui'
import { useNotFoundPage } from './NotFoundPage.hooks'

export const NotFoundPage = () => {
  const { t, brokenPath, canGoBack, isAuthenticated, handleBack, handleHome } = useNotFoundPage()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <AppLogo />

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-6xl font-bold text-slate-900">404</span>
        <h1 className="text-2xl font-semibold text-slate-800">{t.notFound.heading}</h1>

        {brokenPath && (
          <code className="mt-1 max-w-sm rounded bg-slate-100 px-3 py-1.5 font-mono text-sm break-all text-slate-600">
            {brokenPath}
          </code>
        )}

        <p className="max-w-sm text-sm text-slate-500">{t.notFound.message}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {canGoBack && (
          <Button variant="secondary" icon="RiArrowLeftLine" onClick={handleBack}>
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
