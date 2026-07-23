import { it as dateFnsIt } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const it: DashboardTranslations = {
  welcome: (name) => `Benvenuto, ${name}`,
  summary: 'Riepilogo',
  recentActivity: 'Attività recente',
  noRecentActivity: 'Nessuna attività recente.',
  kpi: { clients: 'Clienti', users: 'Utenti', services: 'Servizi' },
  activityBy: (user, resource, verb) => `${user} — ${resource}: ${verb}`,
  dateFormat: 'EEEE d MMMM yyyy',
  dateLocale: dateFnsIt,
}
