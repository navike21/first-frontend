import { AppLogo, LinkButton, LanguageSwitcher } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useErrorTranslation } from '../../i18n'

export const ForbiddenPage = () => {
  const { t } = useErrorTranslation()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <AppLogo />
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-6xl font-bold text-slate-900">403</span>
        <h1 className="text-2xl font-semibold text-slate-800">{t.forbidden.heading}</h1>
        <p className="max-w-sm text-sm text-slate-500">{t.forbidden.message}</p>
      </div>
      <LinkButton variant="primary" href={navPaths.login()}>
        {t.forbidden.loginButton}
      </LinkButton>
    </div>
  )
}
