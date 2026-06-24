import type { AuditLogsTranslations } from '../types'

export const zh: AuditLogsTranslations = {
  page: {
    title: '审计日志',
    desc: '系统活动与审计日志模块',
  },
  table: {
    colDate: '日期与时间',
    colUser: '用户 ID',
    colAction: '操作',
    colResource: '资源',
    colIp: 'IP 地址',
    noResults: '未找到审计日志',
    prevPage: '上一页',
    nextPage: '下一页',
    totalCount: (n) => `共 ${n} 条审计日志`,
  },
}
