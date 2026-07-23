import { enUS } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const en: DashboardTranslations = {
  welcome: (name) => `Welcome, ${name}`,
  summary: 'Summary',
  recentActivity: 'Recent activity',
  noRecentActivity: 'No recent activity.',
  kpi: { clients: 'Clients', users: 'Users', services: 'Services' },
  activityBy: (user, resource, verb) => `${user} — ${resource}: ${verb}`,
  dateFormat: 'EEEE, MMMM d, yyyy',
  dateLocale: enUS,
}
