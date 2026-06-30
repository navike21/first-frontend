import { LinkButton, LanguageSwitcher } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useErrorTranslation } from '../../i18n'

export const ForbiddenPage = () => {
  const { t } = useErrorTranslation()

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 bg-surface px-4 py-6">
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <span className="text-2xl font-bold tracking-tight text-foreground">
        First
      </span>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-6xl font-bold text-foreground">403</span>
        <h1 className="text-2xl font-semibold text-foreground">
          {t.forbidden.heading}
        </h1>
        <p className="max-w-sm text-sm text-secondary">
          {t.forbidden.message}
        </p>
      </div>
      <LinkButton variant="primary" href={navPaths.login()}>
        {t.forbidden.loginButton}
      </LinkButton>
    </div>
  )
}
