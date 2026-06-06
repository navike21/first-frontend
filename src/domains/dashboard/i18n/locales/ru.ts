import { ru as dateFnsRu } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const ru: DashboardTranslations = {
  welcome: (name) => `Добро пожаловать, ${name}`,
  summary: 'Обзор',
  recentActivity: 'Последние действия',
  noRecentActivity: 'Нет последних действий.',
  kpi: { clients: 'Клиенты', users: 'Пользователи', services: 'Услуги' },
  dateFormat: "EEEE, d MMMM yyyy 'г.'",
  dateLocale: dateFnsRu,
}
