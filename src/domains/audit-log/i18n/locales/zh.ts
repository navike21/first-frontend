import type { AuditLogsTranslations } from '../types'

export const zh: AuditLogsTranslations = {
  page: {
    title: '审计日志',
    desc: '系统 activity 与审计日志模块',
  },
  table: {
    colDate: '日期与时间',
    colUser: '用户',
    colAction: '操作',
    colResource: '资源',
    colIp: 'IP 地址',
    colActions: '操作',
    noResults: '未找到审计日志',
    prevPage: '上一页',
    nextPage: '下一页',
    totalCount: (n) => `共 ${n} 条审计日志`,
    viewDetail: '查看详情',
  },
  detail: {
    title: '日志条目详情',
    colUserAgent: '设备 / 用户代理',
    colMetadata: '操作数据 (元数据)',
    closeButton: '关闭',
  },
}
