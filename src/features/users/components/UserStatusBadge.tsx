import { Badge } from '@shared/ui/Badge'
import type { User } from '../model/types'

interface UserStatusBadgeProps {
  status: User['status']
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return (
    <Badge variant={status === 'active' ? 'success' : 'danger'}>
      {status === 'active' ? 'Activo' : 'Inactivo'}
    </Badge>
  )
}
