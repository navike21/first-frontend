import { PageHeader } from '@/shared/ui'
import { useLanguageStore } from '@/shared/model'
import type { Language } from '@/shared/types/languages'

const translations: Record<string, Record<string, string>> = {
  es: {
    title: 'Auditoría',
    desc: 'Módulo de registro de actividades y auditoría',
    construction: 'Este módulo se encuentra en construcción.',
    sub: 'Próximamente podrás visualizar las bitácoras y registros de auditoría aquí.',
  },
  en: {
    title: 'Audit Logs',
    desc: 'Activity and audit logs module',
    construction: 'This module is currently under construction.',
    sub: 'Soon you will be able to view audit logs and trace user activity here.',
  },
}

export const AuditLogsPage = () => {
  const language = useLanguageStore((s) => s.language) as Language
  const t = translations[language] ?? translations.en

  return (
    <div className="animate-page-in space-y-6">
      <PageHeader title={t.title} description={t.desc} />
      <div className="rounded-xl border border-(--border) bg-(--surface) p-8 text-center text-(--text-secondary)">
        <p className="text-lg font-medium">{t.construction}</p>
        <p className="mt-2 text-sm text-(--text-muted)">{t.sub}</p>
      </div>
    </div>
  )
}
