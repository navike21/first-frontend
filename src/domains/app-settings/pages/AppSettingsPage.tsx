import { PageContent } from '@/shared/ui'
import { useLanguageStore } from '@/shared/model'
import type { Language } from '@/shared/types/languages'

const translations: Record<string, Record<string, string>> = {
  es: {
    title: 'Configuración de la Aplicación',
    desc: 'Módulo de configuración global del sistema',
    construction: 'Este módulo se encuentra en construcción.',
    sub: 'Próximamente podrás editar las configuraciones globales y preferencias aquí.',
  },
  en: {
    title: 'App Settings',
    desc: 'Global system configuration module',
    construction: 'This module is currently under construction.',
    sub: 'Soon you will be able to edit global configurations and system preferences here.',
  },
}

export const AppSettingsPage = () => {
  const language = useLanguageStore((s) => s.language) as Language
  const t = translations[language] ?? translations.en

  return (
    <PageContent title={t.title} description={t.desc}>
      <div className="rounded-xl border border-border bg-surface p-8 text-center text-secondary">
        <p className="text-lg font-medium">{t.construction}</p>
        <p className="mt-2 text-sm text-muted">{t.sub}</p>
      </div>
    </PageContent>
  )
}
