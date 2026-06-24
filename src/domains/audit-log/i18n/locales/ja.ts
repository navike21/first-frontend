import type { AuditLogsTranslations } from '../types'

export const ja: AuditLogsTranslations = {
  page: {
    title: '監査ログ',
    desc: 'システムアクティビティおよび監査ログモジュール',
  },
  table: {
    colDate: '日時',
    colUser: 'ユーザーID',
    colAction: 'アクション',
    colResource: 'リソース',
    colIp: 'IPアドレス',
    noResults: '監査ログが見つかりません',
    prevPage: '前のページ',
    nextPage: '次のページ',
    totalCount: (n) => `合計 ${n} 件の監査ログ`,
  },
}
