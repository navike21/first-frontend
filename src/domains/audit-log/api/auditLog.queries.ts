import { useQuery } from '@tanstack/react-query'
import { auditLogApi } from './auditLog.api'
import type { AuditLogsListParams } from './auditLog.api'

export const auditLogKeys = {
  all: ['auditLogs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (params: AuditLogsListParams) =>
    [...auditLogKeys.lists(), params] as const,
}

export const useAuditLogs = (params: AuditLogsListParams = {}) =>
  useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => auditLogApi.list(params),
    placeholderData: (prev) => prev,
    staleTime: 0, // Always fetch fresh logs when navigating to the page
  })
