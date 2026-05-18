import { LanguageSwitcher } from '@/shared/ui'
import { LoginForm } from './LoginForm'
import { useLoginTranslation } from '../i18n'

export const LoginLayout = () => {
  const { t } = useLoginTranslation()

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm px-6 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-bold text-xl text-white">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-base font-semibold text-slate-800">{t.form.submit}</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
