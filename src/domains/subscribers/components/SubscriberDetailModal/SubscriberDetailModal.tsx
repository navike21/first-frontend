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
              <span className="text-foreground text-base font-bold">
                {subscriber.firstName} {subscriber.lastName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-secondary text-sm">
                  {subscriber.contactInformation.email}
                </span>
                <Chip
                  size="x-small"
                  variant={
                    subscriber.status === 'active' ? 'success' : 'default'
                  }
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
            {subscriber.location?.countryCode && (
              <DetailField
                label={t.form.country}
                value={subscriber.location.countryCode}
              />
            )}
            {(subscriber.location?.region || subscriber.location?.province) && (
              <DetailField
                label={t.form.region}
                value={[
                  subscriber.location.region,
                  subscriber.location.province,
                ]
                  .filter(Boolean)
                  .join(' — ')}
              />
            )}
            {subscriber.location?.address && (
              <DetailField
                label={t.form.addressStreet}
                value={[
                  subscriber.location.address,
                  subscriber.location.addressNumber,
                  subscriber.location.addressInterior,
                ]
                  .filter(Boolean)
                  .join(', ')}
              />
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
