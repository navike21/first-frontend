import type { ReactNode } from 'react'
import { Modal, Button, Avatar, Chip, CountryLabel } from '@/shared/ui'
import { formatDate } from '@/shared/lib'
import { useConfig, labelFor } from '@/shared/api/config'
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

const Field = ({ label, value }: { label: string; value?: ReactNode }) => {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
    {children}
  </p>
)

export const UserDetailModal = ({
  user,
  onClose,
  onRestore,
  onPurge,
  canRestore = false,
  canPurge = false,
}: UserDetailModalProps) => {
  const { t, language } = useUsersTranslation()
  const { data: config } = useConfig(['genders'], language)
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
            <Field label={t.form.phone} value={user.phone || dash} />
            <Field
              label={t.form.dateOfBirth}
              value={formatDate(user.dateOfBirth) || dash}
            />
            <Field label={t.form.gender} value={labelFor(config?.genders, user.gender) || dash} />
            <Field
              label={t.detail.emailVerified}
              value={
                user.isEmailVerified
                  ? t.detail.emailVerifiedYes
                  : t.detail.emailVerifiedNo
              }
            />
            <Field
              label={t.detail.lastSeen}
              value={formatDate(user.lastSeenAt) || dash}
            />
            {user.deletedAt && (
              <Field
                label={t.table.deletedAt}
                value={formatDate(user.deletedAt)}
              />
            )}
          </div>

          {user.address && Object.values(user.address).some(Boolean) && (
            <div>
              <SectionTitle>{t.form.addressSection}</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {user.address.country && (
                  <Field
                    label={t.form.addressCountry}
                    value={<CountryLabel code={user.address.country} />}
                  />
                )}
                <Field label={t.form.addressRegion} value={user.address.region} />
                <Field
                  label={t.form.addressProvince}
                  value={user.address.province}
                />
                <Field label={t.form.address} value={user.address.address} />
                <Field
                  label={t.form.addressNumber}
                  value={user.address.addressNumber}
                />
                <Field
                  label={t.form.addressInterior}
                  value={user.address.addressInterior}
                />
              </div>
            </div>
          )}

          {user.groupIds && user.groupIds.length > 0 && (
            <Field
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
