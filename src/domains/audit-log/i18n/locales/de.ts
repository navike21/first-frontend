import type { AuditLogsTranslations } from '../types'

export const de: AuditLogsTranslations = {
  page: {
    title: 'Audit-Protokolle',
    desc: 'Systemaktivitäts- und Audit-Protokoll-Modul',
  },
  table: {
    colDate: 'Datum & Uhrzeit',
    colUser: 'Benutzer-ID',
    colAction: 'Aktion',
    colResource: 'Ressource',
    colIp: 'IP-Adresse',
    noResults: 'Keine Audit-Protokolle gefunden',
    prevPage: 'Vorherige Seite',
    nextPage: 'Nächste Seite',
    totalCount: (n) => `${n} Audit-Protokoll${n !== 1 ? 'le' : ''} insgesamt`,
  },
}
