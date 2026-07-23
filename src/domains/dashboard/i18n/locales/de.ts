import { de as dateFnsDe } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const de: DashboardTranslations = {
  welcome: (name) => `Willkommen, ${name}`,
  summary: 'Übersicht',
  recentActivity: 'Letzte Aktivitäten',
  noRecentActivity: 'Keine aktuellen Aktivitäten.',
  kpi: { clients: 'Kunden', users: 'Benutzer', services: 'Dienste' },
  activityBy: (user, resource, verb) => `${user} — ${resource}: ${verb}`,
  dateFormat: 'EEEE, d. MMMM yyyy',
  dateLocale: dateFnsDe,
}
