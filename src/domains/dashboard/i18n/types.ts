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
  /** `resource`/`verb` come straight from the audit log's action code
   * (e.g. "subscribers" / "deleted") and are intentionally left as-is —
   * same convention as the raw action chips on the Audit Log page. */
  activityBy: (user: string, resource: string, verb: string) => string
  dateFormat: string
  dateLocale: Locale
}
