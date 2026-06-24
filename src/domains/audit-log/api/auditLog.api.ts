import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'

export interface AuditLog {
  id: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  occurredAt: string
}

export interface AuditLogsListParams {
  userId?: string
  action?: string
  resource?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface AuditLogPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

const BASE = '/audit-logs'

export const auditLogApi = {
  list: (params: AuditLogsListParams = {}) => {
    const query = new URLSearchParams()
    if (params.userId) query.set('userId', params.userId)
    if (params.action) query.set('action', params.action)
    if (params.resource) query.set('resource', params.resource)
    if (params.dateFrom) query.set('dateFrom', params.dateFrom)
    if (params.dateTo) query.set('dateTo', params.dateTo)
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<AuditLog[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },
}
