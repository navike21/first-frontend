import { fr as dateFnsFr } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const fr: DashboardTranslations = {
  welcome: (name) => `Bienvenue, ${name}`,
  summary: 'Résumé',
  recentActivity: 'Activité récente',
  noRecentActivity: "Pas d'activité récente.",
  kpi: { clients: 'Clients', users: 'Utilisateurs', services: 'Services' },
  dateFormat: 'EEEE d MMMM yyyy',
  dateLocale: dateFnsFr,
}
