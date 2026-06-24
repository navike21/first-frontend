import type { AuditLogsTranslations } from '../types'

export const fr: AuditLogsTranslations = {
  page: {
    title: "Journaux d'audit",
    desc: "Module d'activité système et de journaux d'audit",
  },
  table: {
    colDate: 'Date et heure',
    colUser: 'Utilisateur',
    colAction: 'Action',
    colResource: 'Ressource',
    colIp: 'Adresse IP',
    colActions: 'Actions',
    noResults: "Aucun journal d'audit trouvé",
    prevPage: 'Page précédente',
    nextPage: 'Page suivante',
    totalCount: (n) => `${n} journal d'audit${n !== 1 ? 's' : ''} au total`,
    viewDetail: 'Voir les détails',
  },
  detail: {
    title: 'Détails du journal',
    colUserAgent: 'Appareil / Agent utilisateur',
    colMetadata: "Données d'action (Métadonnées)",
    closeButton: 'Fermer',
  },
  filters: {
    dateFrom: 'Date du',
    dateTo: 'Date au',
    clear: 'Effacer les filtres',
  },
}
