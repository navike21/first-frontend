import type { AuditLogsTranslations } from '../types'

export const en: AuditLogsTranslations = {
  page: {
    title: 'Audit Logs',
    desc: 'System activity and audit logs module',
  },
  table: {
    colDate: 'Date & Time',
    colUser: 'User',
    colAction: 'Action',
    colResource: 'Resource',
    colIp: 'IP Address',
    colActions: 'Actions',
    noResults: 'No audit logs found',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    totalCount: (n) => `${n} audit log${n !== 1 ? 's' : ''} in total`,
    viewDetail: 'View details',
  },
  detail: {
    title: 'Log Entry Details',
    colUserAgent: 'Device / User Agent',
    colMetadata: 'Action Data (Metadata)',
    closeButton: 'Close',
  },
}
