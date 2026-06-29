import type { AuditLogsTranslations } from '../types'

export const pt: AuditLogsTranslations = {
  page: {
    title: 'Registros de Auditoria',
    desc: 'Módulo de atividades do sistema e registros de auditoria',
  },
  table: {
    colDate: 'Data e Hora',
    colUser: 'Usuário',
    colAction: 'Ação',
    colResource: 'Recurso',
    colIp: 'Endereço IP',
    colActions: 'Ações',
    noResults: 'Nenhum registro de auditoria encontrado',
    prevPage: 'Página anterior',
    nextPage: 'Próxima página',
    totalCount: (n) =>
      `${n} registro${n !== 1 ? 's' : ''} de auditoria no total`,
    viewDetail: 'Ver detalhes',
  },
  detail: {
    title: 'Detalhes do registro',
    colUserAgent: 'Dispositivo / User Agent',
    colMetadata: 'Dados da ação (Metados)',
    closeButton: 'Fechar',
  },
  filters: {
    dateFrom: 'Data de',
    dateTo: 'Data até',
    clear: 'Limpar filtros',
  },
}
