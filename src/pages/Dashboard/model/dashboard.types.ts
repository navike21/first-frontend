export type KpiKey = 'clients' | 'users' | 'services'

export interface KpiCard {
  key: KpiKey
  value: number | string
  icon: string
}

export interface RecentActivity {
  text: string
  timestamp: string
}
