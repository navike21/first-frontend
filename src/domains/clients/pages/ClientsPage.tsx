import { PageContent } from '@/shared/ui'
import { useLanguageStore } from '@/shared/model'
import type { Language } from '@/shared/types/languages'

const translations: Record<string, Record<string, string>> = {
  es: {
    title: 'Clientes',
    desc: 'Módulo de gestión de clientes',
    construction: 'Este módulo se encuentra en construcción.',
    sub: 'Próximamente podrás gestionar tus clientes comerciales aquí.',
  },
  en: {
    title: 'Clients',
    desc: 'Client management module',
    construction: 'This module is currently under construction.',
    sub: 'Soon you will be able to manage your commercial clients here.',
  },
}

export const ClientsPage = () => {
  const language = useLanguageStore((s) => s.language) as Language
  const t = translations[language] ?? translations.en

  return (
    <PageContent title={t.title} description={t.desc}>
      <div className="rounded-xl border border-(--border) bg-(--surface) p-8 text-center text-(--text-secondary)">
        <p className="text-lg font-medium">{t.construction}</p>
        <p className="mt-2 text-sm text-(--text-muted)">{t.sub}</p>
      </div>
    </PageContent>
  )
}
