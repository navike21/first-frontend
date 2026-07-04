import type { ReactNode } from 'react'
import { Modal, Avatar, Chip } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import { useSubscribersTranslation } from '../../i18n'
import type { Subscriber } from '../../model/subscriber.types'

interface SubscriberDetailModalProps {
  subscriber: Subscriber | null
  onClose: () => void
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

export const SubscriberDetailModal = ({
  subscriber,
  onClose,
}: SubscriberDetailModalProps) => {
  const { t } = useSubscribersTranslation()

  return (
    <Modal
      isOpen={!!subscriber}
      onClose={onClose}
      size="lg"
      title={t.table.viewSubscriber}
    >
      {subscriber && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar
              alt={`${subscriber.firstName} ${subscriber.lastName}`}
              src={subscriber.personalInformation.profilePictureUrl}
              name={`${subscriber.firstName} ${subscriber.lastName}`}
              size="md"
            />
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">
                {subscriber.firstName} {subscriber.lastName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">
                  {subscriber.contactInformation.email}
                </span>
                <Chip
                  size="x-small"
                  variant={subscriber.status === 'active' ? 'success' : 'default'}
                >
                  {t.status[subscriber.status]}
                </Chip>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label={t.form.gender}
              value={t.genders[subscriber.personalInformation.gender]}
            />
            <Field
              label={t.form.dateOfBirth}
              value={
                subscriber.personalInformation.dateOfBirth
                  ? formatDate(subscriber.personalInformation.dateOfBirth)
                  : undefined
              }
            />
            <Field
              label={t.form.phoneNumber}
              value={subscriber.contactInformation.phoneNumber}
            />
            <Field
              label={t.form.address}
              value={subscriber.contactInformation.address}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
