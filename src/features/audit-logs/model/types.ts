import type { PaginationParams } from '@shared/api/types'

export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface AuditLogParams extends PaginationParams {
  userId?: string
  resource?: string
  action?: string
  startDate?: string
  endDate?: string
}
