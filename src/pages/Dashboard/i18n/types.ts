import type { Locale } from 'date-fns'

export interface DashboardTranslations {
  welcome: (name: string) => string
  summary: string
  recentActivity: string
  noRecentActivity: string
  kpi: {
    clients: string
    users: string
    services: string
  }
  dateFormat: string
  dateLocale: Locale
}
