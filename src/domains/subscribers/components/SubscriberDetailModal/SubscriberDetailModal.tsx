import { Modal, Avatar, Chip, DetailField } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import { useSubscribersTranslation } from '../../i18n'
import type { Subscriber } from '../../model/subscriber.types'

interface SubscriberDetailModalProps {
  subscriber: Subscriber | null
  onClose: () => void
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
            <DetailField
              label={t.form.gender}
              value={t.genders[subscriber.personalInformation.gender]}
            />
            <DetailField
              label={t.form.dateOfBirth}
              value={
                subscriber.personalInformation.dateOfBirth
                  ? formatDate(subscriber.personalInformation.dateOfBirth)
                  : undefined
              }
            />
            <DetailField
              label={t.form.phoneNumber}
              value={subscriber.contactInformation.phoneNumber}
            />
            <DetailField
              label={t.form.address}
              value={subscriber.contactInformation.address}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
