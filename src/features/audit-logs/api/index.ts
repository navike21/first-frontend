import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import type { ApiResponse, PaginatedResponse } from '@shared/api/types'
import type { AuditLog, AuditLogParams } from '../model/types'

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (params?: AuditLogParams) => ['audit-logs', 'list', params] as const,
}

export function useAuditLogs(params?: AuditLogParams) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AuditLog>>>(
        '/audit-logs',
        { params },
      )
      return data.data
    },
  })
}
