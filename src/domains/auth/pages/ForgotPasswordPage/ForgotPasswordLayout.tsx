import { LanguageSwitcher, BrandMark } from '@/shared/ui'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { useAuthTranslation } from '../../i18n'

export const ForgotPasswordLayout = () => {
  const { t } = useAuthTranslation()

  return (
    <div className="relative flex min-h-dvh flex-col bg-surface-subtle">
      <div className="fixed top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="sr-only">{t.forgotPassword.heading}</h1>
            <BrandMark size="small" animateIn />
            <p className="mt-1 text-sm text-secondary">{t.forgotPassword.subtitle}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
