import type { AuditLogsTranslations } from '../types'

export const pt: AuditLogsTranslations = {
  page: {
    title: 'Registros de Auditoria',
    desc: 'Módulo de atividades do sistema e registros de auditoria',
  },
  table: {
    colDate: 'Data e Hora',
    colUser: 'ID do Usuário',
    colAction: 'Ação',
    colResource: 'Recurso',
    colIp: 'Endereço IP',
    noResults: 'Nenhum registro de auditoria encontrado',
    prevPage: 'Página anterior',
    nextPage: 'Próxima página',
    totalCount: (n) => `${n} registro${n !== 1 ? 's' : ''} de auditoria no total`,
  },
}
