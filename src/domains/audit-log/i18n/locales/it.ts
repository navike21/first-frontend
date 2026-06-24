import type { AuditLogsTranslations } from '../types'

export const it: AuditLogsTranslations = {
  page: {
    title: 'Registri di audit',
    desc: 'Modulo delle attività di sistema e dei registri di audit',
  },
  table: {
    colDate: 'Data e ora',
    colUser: 'Utente',
    colAction: 'Azione',
    colResource: 'Risorsa',
    colIp: 'Indirizzo IP',
    colActions: 'Azioni',
    noResults: 'Nessun registro di audit trovato',
    prevPage: 'Pagina precedente',
    nextPage: 'Pagina successiva',
    totalCount: (n) => `${n} registr${n !== 1 ? 'i' : 'o'} di audit in totale`,
    viewDetail: 'Visualizza dettagli',
  },
  detail: {
    title: 'Dettagli voce di registro',
    colUserAgent: 'Dispositivo / User Agent',
    colMetadata: 'Dati azione (Metadati)',
    closeButton: 'Chiudi',
  },
}
