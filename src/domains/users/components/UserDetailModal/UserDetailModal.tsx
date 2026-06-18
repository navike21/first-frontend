import type { ReactNode } from 'react'
import { Modal, Button, Avatar } from '@/shared/ui'
import { formatDate } from '@/shared/lib'
import { useUsersTranslation } from '../../i18n'
import { UserStatusBadge } from '../UserStatusBadge/UserStatusBadge'
import type { User } from '../../model/user.types'

interface UserDetailModalProps {
  user: User | null
  onClose: () => void
  onRestore?: () => void
  onPurge?: () => void
  canRestore?: boolean
  canPurge?: boolean
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between gap-4 border-b border-(--border-subtle) py-2 last:border-0">
    <span className="text-sm text-(--text-secondary)">{label}</span>
    <span className="text-sm font-medium text-(--text-primary)">{value}</span>
  </div>
)

export const UserDetailModal = ({
  user,
  onClose,
  onRestore,
  onPurge,
  canRestore = false,
  canPurge = false,
}: UserDetailModalProps) => {
  const { t } = useUsersTranslation()
  const dash = '—'

  const showRestore = canRestore && !!onRestore
  const showPurge = canPurge && !!onPurge

  return (
    <Modal
      isOpen={!!user}
      onClose={onClose}
      size="lg"
      title={t.detail.title}
      footer={
        showRestore || showPurge ? (
          <>
            {showRestore && (
              <Button variant="primary" onClick={onRestore}>
                {t.actions.restoreUser}
              </Button>
            )}
            {showPurge && (
              <Button variant="error" onClick={onPurge}>
                {t.detail.purgeButton}
              </Button>
            )}
          </>
        ) : undefined
      }
    >
      {user && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              alt={`${user.firstName} ${user.lastName}`}
              src={user.profilePictureUrl}
              name={`${user.firstName} ${user.lastName}`}
              size="md"
            />
            <div>
              <p className="font-semibold text-(--text-primary)">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-(--text-secondary)">{user.email}</p>
            </div>
          </div>
          <div>
            <Row label={t.form.phone} value={user.phone || dash} />
            <Row
              label={t.form.dateOfBirth}
              value={formatDate(user.dateOfBirth)}
            />
            <Row
              label={t.form.statusLabel}
              value={<UserStatusBadge status={user.status} />}
            />
            <Row label={t.table.deletedAt} value={formatDate(user.deletedAt)} />
          </div>
        </div>
      )}
    </Modal>
  )
}
