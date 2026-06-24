import type { AuditLogsTranslations } from '../types'

export const it: AuditLogsTranslations = {
  page: {
    title: 'Registri di audit',
    desc: 'Modulo delle attività di sistema e dei registri di audit',
  },
  table: {
    colDate: 'Data e ora',
    colUser: 'ID Utente',
    colAction: 'Azione',
    colResource: 'Risorsa',
    colIp: 'Indirizzo IP',
    noResults: 'Nessun registro di audit trovato',
    prevPage: 'Pagina precedente',
    nextPage: 'Pagina successiva',
    totalCount: (n) => `${n} registr${n !== 1 ? 'i' : 'o'} di audit in totale`,
  },
}
