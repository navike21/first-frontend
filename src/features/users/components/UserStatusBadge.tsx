import { Chip } from '@shared/ui'
import type { User } from '../model/types'

interface UserStatusBadgeProps {
  status: User['status']
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return (
    <Chip variant={status === 'active' ? 'success' : 'error'}>
      {status === 'active' ? 'Activo' : 'Inactivo'}
    </Chip>
  )
}
