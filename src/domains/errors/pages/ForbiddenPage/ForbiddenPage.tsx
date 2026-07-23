import { LinkButton, LanguageSwitcher, BrandMark } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useErrorTranslation } from '../../i18n'

export const ForbiddenPage = () => {
  const { t } = useErrorTranslation()

  return (
    <div className="bg-surface relative flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-6">
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <BrandMark size="small" animateIn />
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-display text-foreground text-6xl font-bold">
          403
        </span>
        <h1 className="text-foreground text-2xl font-semibold">
          {t.forbidden.heading}
        </h1>
        <p className="text-secondary max-w-sm text-sm">{t.forbidden.message}</p>
      </div>
      <LinkButton variant="primary" href={navPaths.login()}>
        {t.forbidden.loginButton}
      </LinkButton>
    </div>
  )
}
