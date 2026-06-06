import { es as dateFnsEs } from 'date-fns/locale'
import type { DashboardTranslations } from '../types'

export const es: DashboardTranslations = {
  welcome: (name) => `Bienvenido, ${name}`,
  summary: 'Resumen',
  recentActivity: 'Actividad reciente',
  noRecentActivity: 'No hay actividad reciente.',
  kpi: { clients: 'Clientes', users: 'Usuarios', services: 'Servicios' },
  dateFormat: "EEEE, d 'de' MMMM 'de' yyyy",
  dateLocale: dateFnsEs,
}
