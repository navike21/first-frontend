import type { AuditLogsTranslations } from '../types'

export const es: AuditLogsTranslations = {
  page: {
    title: 'Auditoría',
    desc: 'Módulo de registro de actividades y auditoría del sistema',
  },
  table: {
    colDate: 'Fecha y Hora',
    colUser: 'Usuario ID',
    colAction: 'Acción',
    colResource: 'Recurso',
    colIp: 'Dirección IP',
    noResults: 'No se encontraron registros de auditoría',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    totalCount: (n) => `${n} registro${n !== 1 ? 's' : ''} en total`,
  },
}
