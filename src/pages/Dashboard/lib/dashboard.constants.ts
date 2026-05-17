import type { KpiCard, RecentActivity } from '../model/dashboard.types'

export const KPI_CARDS: ReadonlyArray<KpiCard> = [
  { key: 'clients', value: '--', icon: 'RiBuilding4Line' },
  { key: 'users', value: '--', icon: 'RiTeamLine' },
  { key: 'services', value: '--', icon: 'RiBriefcaseLine' },
]

export const RECENT_ACTIVITY: ReadonlyArray<RecentActivity> = []
