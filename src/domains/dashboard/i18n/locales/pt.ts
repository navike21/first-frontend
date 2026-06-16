import { ptBR } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const pt: DashboardTranslations = {
  welcome: (name) => `Bem-vindo, ${name}`,
  summary: 'Resumo',
  recentActivity: 'Atividade recente',
  noRecentActivity: 'Nenhuma atividade recente.',
  kpi: { clients: 'Clientes', users: 'Usuários', services: 'Serviços' },
  dateFormat: "EEEE, d 'de' MMMM 'de' yyyy",
  dateLocale: ptBR,
}
