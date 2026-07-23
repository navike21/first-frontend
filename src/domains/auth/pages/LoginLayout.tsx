import { LanguageSwitcher, BrandMark } from '@/shared/ui'
import { LoginForm } from './LoginForm'
import { useAuthTranslation } from '../i18n'

export const LoginLayout = () => {
  const { t } = useAuthTranslation()

  return (
    <div className="bg-surface-subtle relative flex min-h-dvh flex-col">
      {/* Pinned to the visual viewport (fixed) so it stays visible when the
          mobile keyboard opens and the document scrolls. */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="sr-only">{t.title}</h1>
            <BrandMark size="small" animateIn />
            <p className="text-secondary mt-1 text-sm">{t.subtitle}</p>
          </div>
          <div className="border-border bg-surface rounded-xl border p-6 shadow-sm sm:p-8">
            <h2 className="text-foreground mb-6 text-base font-semibold">
              {t.form.submit}
            </h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
