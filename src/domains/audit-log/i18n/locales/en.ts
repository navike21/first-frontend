import type { AuditLogsTranslations } from '../types'

export const en: AuditLogsTranslations = {
  page: {
    title: 'Audit Logs',
    desc: 'System activity and audit logs module',
  },
  table: {
    colDate: 'Date & Time',
    colUser: 'User ID',
    colAction: 'Action',
    colResource: 'Resource',
    colIp: 'IP Address',
    noResults: 'No audit logs found',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    totalCount: (n) => `${n} audit log${n !== 1 ? 's' : ''} in total`,
  },
}
