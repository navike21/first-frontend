import { ja as dateFnsJa } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const ja: DashboardTranslations = {
  welcome: (name) => `ようこそ、${name}`,
  summary: '概要',
  recentActivity: '最近のアクティビティ',
  noRecentActivity: '最近のアクティビティはありません。',
  kpi: { clients: 'クライアント', users: 'ユーザー', services: 'サービス' },
  activityBy: (user, resource, verb) => `${user} — ${resource}: ${verb}`,
  dateFormat: 'yyyy年M月d日（EEEE）',
  dateLocale: dateFnsJa,
}
