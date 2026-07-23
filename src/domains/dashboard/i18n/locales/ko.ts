import { ko as dateFnsKo } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const ko: DashboardTranslations = {
  welcome: (name) => `환영합니다, ${name}`,
  summary: '요약',
  recentActivity: '최근 활동',
  noRecentActivity: '최근 활동이 없습니다.',
  kpi: { clients: '클라이언트', users: '사용자', services: '서비스' },
  activityBy: (user, resource, verb) => `${user} — ${resource}: ${verb}`,
  dateFormat: 'yyyy년 M월 d일 EEEE',
  dateLocale: dateFnsKo,
}
