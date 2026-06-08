import clsx from 'clsx'
import { LanguageSwitcher } from '@/shared/ui'
import { LoginForm } from './LoginForm'
import { useLoginTranslation } from '../i18n'

export const LoginLayout = () => {
  const { t } = useLoginTranslation()

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-(--surface-subtle)">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm px-6 py-10">
        <div className="mb-8 text-center">
          <div
            className={clsx(
              'mx-auto mb-4 flex h-12 w-12 items-center justify-center',
              'rounded-xl bg-slate-900 text-xl font-bold text-white'
            )}
          >
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-(--text-secondary)">{t.subtitle}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-8 shadow-sm">
          <h2 className="mb-6 text-base font-semibold text-(--text-primary)">
            {t.form.submit}
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
