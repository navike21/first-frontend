import { LanguageSwitcher } from '@/shared/ui'
import { LoginForm } from './LoginForm'
import { useLoginTranslation } from '../i18n'

export const LoginLayout = () => {
  const { t } = useLoginTranslation()

  return (
    <div className="relative flex min-h-dvh flex-col bg-surface-subtle">
      {/* Pinned to the visual viewport (fixed) so it stays visible when the
          mobile keyboard opens and the document scrolls. */}
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.title}
            </h1>
            <p className="mt-1 text-sm text-secondary">{t.subtitle}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-base font-semibold text-foreground">
              {t.form.submit}
            </h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
