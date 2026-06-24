export interface AuditLogsTranslations {
  page: {
    title: string
    desc: string
  }
  table: {
    colDate: string
    colUser: string
    colAction: string
    colResource: string
    colIp: string
    colActions: string
    noResults: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
    viewDetail: string
  }
  detail: {
    title: string
    colUserAgent: string
    colMetadata: string
    closeButton: string
  }
}
