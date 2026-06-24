import type { AuditLogsTranslations } from '../types'

export const es: AuditLogsTranslations = {
  page: {
    title: 'Auditoría',
    desc: 'Módulo de registro de actividades y auditoría del sistema',
  },
  table: {
    colDate: 'Fecha y Hora',
    colUser: 'Usuario',
    colAction: 'Acción',
    colResource: 'Recurso',
    colIp: 'Dirección IP',
    colActions: 'Acciones',
    noResults: 'No se encontraron registros de auditoría',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    totalCount: (n) => `${n} registro${n !== 1 ? 's' : ''} en total`,
    viewDetail: 'Ver detalles',
  },
  detail: {
    title: 'Detalle del Registro',
    colUserAgent: 'Dispositivo / Navegador',
    colMetadata: 'Datos de la Acción (Metadatos)',
    closeButton: 'Cerrar',
  },
  filters: {
    dateFrom: 'Fecha desde',
    dateTo: 'Fecha hasta',
    clear: 'Limpiar filtros',
  },
}
