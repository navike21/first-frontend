import { Chip } from '@/shared/ui'
import type { UserStatus } from '../../model/user.types'

interface UserStatusBadgeProps {
  status: UserStatus
}

const config: Record<UserStatus, { label: string; variant: 'success' | 'default' | 'error' }> = {
  active: { label: 'Activo', variant: 'success' },
  inactive: { label: 'Inactivo', variant: 'default' },
  deleted: { label: 'Eliminado', variant: 'error' },
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const { label, variant } = config[status]
  return <Chip variant={variant} size="small">{label}</Chip>
}
