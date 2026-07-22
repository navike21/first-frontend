import { Modal, Button, Avatar, Chip, CountryLabel, DetailField, SectionLabel } from '@/shared/ui'
import { formatDate } from '@/shared/lib'
import { useConfigData, labelFor } from '@/shared/api/config'
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

export const UserDetailModal = ({
  user,
  onClose,
  onRestore,
  onPurge,
  canRestore = false,
  canPurge = false,
}: UserDetailModalProps) => {
  const { t, language } = useUsersTranslation()
  const { data: config } = useConfigData(['genders'], language)
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
              <Button variant="destructive" onClick={onPurge}>
                {t.detail.purgeButton}
              </Button>
            )}
          </>
        ) : undefined
      }
    >
      {user && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar
              alt={`${user.firstName} ${user.lastName}`}
              src={user.profilePictureUrl}
              name={`${user.firstName} ${user.lastName}`}
              size="md"
            />
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-sm text-secondary">{user.email}</span>
              <div className="flex items-center gap-2">
                <UserStatusBadge status={user.status} />
                <Chip
                  size="x-small"
                  variant={user.isEmailVerified ? 'success' : 'default'}
                >
                  {user.isEmailVerified
                    ? t.detail.emailVerifiedYes
                    : t.detail.emailVerifiedNo}
                </Chip>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.form.phone} value={user.phone || dash} />
            <DetailField
              label={t.form.dateOfBirth}
              value={formatDate(user.dateOfBirth) || dash}
            />
            <DetailField label={t.form.gender} value={labelFor(config?.genders, user.gender) || dash} />
            <DetailField
              label={t.detail.emailVerified}
              value={
                user.isEmailVerified
                  ? t.detail.emailVerifiedYes
                  : t.detail.emailVerifiedNo
              }
            />
            <DetailField
              label={t.detail.lastSeen}
              value={formatDate(user.lastSeenAt) || dash}
            />
            {user.deletedAt && (
              <DetailField
                label={t.table.deletedAt}
                value={formatDate(user.deletedAt)}
              />
            )}
          </div>

          {user.address && Object.values(user.address).some(Boolean) && (
            <div>
              <SectionLabel className="mb-2">{t.form.addressSection}</SectionLabel>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {user.address.country && (
                  <DetailField
                    label={t.form.addressCountry}
                    value={<CountryLabel code={user.address.country} />}
                  />
                )}
                <DetailField label={t.form.addressRegion} value={user.address.region} />
                <DetailField
                  label={t.form.addressProvince}
                  value={user.address.province}
                />
                <DetailField label={t.form.address} value={user.address.address} />
                <DetailField
                  label={t.form.addressNumber}
                  value={user.address.addressNumber}
                />
                <DetailField
                  label={t.form.addressInterior}
                  value={user.address.addressInterior}
                />
              </div>
            </div>
          )}

          {user.groupIds && user.groupIds.length > 0 && (
            <DetailField
              label={t.detail.groups}
              value={
                <div className="flex flex-wrap gap-1">
                  {user.groupIds.map((id) => (
                    <Chip key={id} size="x-small">
                      {id}
                    </Chip>
                  ))}
                </div>
              }
            />
          )}
        </div>
      )}
    </Modal>
  )
}
