import { useHasPermission, CAN } from '@/shared/lib/permissions'
import { useClients } from '@/domains/clients'
import type { ClientPaginationMeta } from '@/domains/clients'
import { useUsersMeta } from '@/domains/users'
import { useServices } from '@/domains/services'
import type { ServicePaginationMeta } from '@/domains/services'
import { useAuditLogs } from '@/domains/audit-log'
import type { AuditLog } from '@/domains/audit-log'
import { formatDateTime } from '@/shared/lib/formatDateTime'
import { useDashboardTranslation } from '../i18n'
import type { KpiCard, RecentActivity } from '../model/dashboard.types'

const RECENT_ACTIVITY_LIMIT = 5

function kpiValue(canView: boolean, total: number | undefined): number | string {
  if (!canView) return '--'
  return total ?? '--'
}

/** `subscribers:bulk_soft_deleted` → `{ resource: 'subscribers', verb: 'bulk soft deleted' }`. */
function splitAction(action: string): { resource: string; verb: string } {
  const [resource, ...rest] = action.split(':')
  const verb = rest.join(' ').replace(/_/g, ' ')
  return { resource: resource || action, verb: verb || action }
}

export function useDashboardData() {
  const { t } = useDashboardTranslation()

  const canViewClients = useHasPermission(...CAN.clientsView)
  const canViewUsers = useHasPermission(...CAN.usersView)
  const canViewServices = useHasPermission(...CAN.servicesView)
  const canViewAuditLogs = useHasPermission(...CAN.auditLogsView)

  const clients = useClients({ limit: 1 }, { enabled: canViewClients })
  const users = useUsersMeta({ limit: 1 }, { enabled: canViewUsers })
  const services = useServices({ limit: 1 }, { enabled: canViewServices })
  const auditLogs = useAuditLogs(
    { limit: RECENT_ACTIVITY_LIMIT },
    { enabled: canViewAuditLogs }
  )

  const clientsMeta = clients.data?.meta as ClientPaginationMeta | undefined
  const servicesMeta = services.data?.meta as ServicePaginationMeta | undefined

  const kpiCards: KpiCard[] = [
    {
      key: 'clients',
      value: kpiValue(canViewClients, clientsMeta?.total),
      icon: 'RiBuilding4Line',
    },
    {
      key: 'users',
      // Users' list nests pagination inside `data` (PaginatedData<User>)
      // instead of a sibling `meta`, unlike Clients/Services — mirrors
      // usersApi.list()'s actual response shape.
      value: kpiValue(canViewUsers, users.data?.data?.total),
      icon: 'RiTeamLine',
    },
    {
      key: 'services',
      value: kpiValue(canViewServices, servicesMeta?.total),
      icon: 'RiBriefcaseLine',
    },
  ]

  const logs: AuditLog[] = canViewAuditLogs ? (auditLogs.data?.data ?? []) : []
  const recentActivity: RecentActivity[] = logs.map((log) => {
    const userName = log.user
      ? `${log.user.firstName} ${log.user.lastName}`.trim()
      : '—'
    const { resource, verb } = splitAction(log.action)
    return {
      id: log.id,
      timestamp: formatDateTime(log.occurredAt),
      text: t.activityBy(userName, resource, verb),
    }
  })

  return { kpiCards, recentActivity }
}
