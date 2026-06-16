import { Chip } from '@/shared/ui'
import { useUsersTranslation } from '../../i18n'
import type { UserStatus } from '../../model/user.types'

interface UserStatusBadgeProps {
  status: UserStatus
}

const VARIANT: Record<UserStatus, 'success' | 'default' | 'error'> = {
  active: 'success',
  inactive: 'default',
  deleted: 'error',
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const { t } = useUsersTranslation()
  return (
    <Chip variant={VARIANT[status]} size="small">
      {t.status[status]}
    </Chip>
  )
}
