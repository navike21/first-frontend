import { Badge } from '@shared/ui/Badge'
import type { ClientStatus } from '../model/types'

interface ClientStatusBadgeProps {
  status: ClientStatus
}

const statusConfig: Record<
  ClientStatus,
  { label: string; variant: 'success' | 'danger' | 'info' }
> = {
  active: { label: 'Activo', variant: 'success' },
  inactive: { label: 'Inactivo', variant: 'danger' },
  prospect: { label: 'Prospecto', variant: 'info' },
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const { label, variant } = statusConfig[status]
  return <Badge variant={variant}>{label}</Badge>
}
