import { zhCN } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const zh: DashboardTranslations = {
  welcome: (name) => `欢迎，${name}`,
  summary: '概览',
  recentActivity: '最近活动',
  noRecentActivity: '暂无最近活动。',
  kpi: { clients: '客户', users: '用户', services: '服务' },
  activityBy: (user, resource, verb) => `${user} — ${resource}：${verb}`,
  dateFormat: 'yyyy年M月d日 EEEE',
  dateLocale: zhCN,
}
