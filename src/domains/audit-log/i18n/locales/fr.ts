import type { AuditLogsTranslations } from '../types'

export const fr: AuditLogsTranslations = {
  page: {
    title: "Journaux d'audit",
    desc: "Module d'activité système et de journaux d'audit",
  },
  table: {
    colDate: 'Date et heure',
    colUser: 'ID Utilisateur',
    colAction: 'Action',
    colResource: 'Ressource',
    colIp: 'Adresse IP',
    noResults: "Aucun journal d'audit trouvé",
    prevPage: 'Page précédente',
    nextPage: 'Page suivante',
    totalCount: (n) => `${n} journal d'audit${n !== 1 ? 's' : ''} au total`,
  },
}
