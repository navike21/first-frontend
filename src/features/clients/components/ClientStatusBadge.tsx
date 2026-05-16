import { Chip } from '@shared/ui'
import type { ClientStatus } from '../model/types'

interface ClientStatusBadgeProps {
  status: ClientStatus
}

const statusConfig: Record<
  ClientStatus,
  { label: string; variant: 'success' | 'error' | 'informative' }
> = {
  active: { label: 'Activo', variant: 'success' },
  inactive: { label: 'Inactivo', variant: 'error' },
  prospect: { label: 'Prospecto', variant: 'informative' },
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const { label, variant } = statusConfig[status]
  return <Chip variant={variant}>{label}</Chip>
}
