import { Modal, Chip, DetailField } from '@/shared/ui'
import { useInventoryTranslation } from '../../i18n'
import type { Location } from '../../model/location.types'

interface LocationDetailModalProps {
  location: Location | null
  onClose: () => void
}

export const LocationDetailModal = ({
  location,
  onClose,
}: LocationDetailModalProps) => {
  const { t } = useInventoryTranslation()

  const addressLine = (() => {
    if (!location?.address) return '—'
    const {
      address,
      addressNumber,
      addressInterior,
      district,
      province,
      region,
      country,
    } = location.address
    return (
      [
        address,
        addressNumber,
        addressInterior,
        district,
        province,
        region,
        country,
      ]
        .filter(Boolean)
        .join(', ') || '—'
    )
  })()

  return (
    <Modal
      isOpen={!!location}
      onClose={onClose}
      size="lg"
      title={t.table.viewLocation}
    >
      {location && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-base font-bold">
                {location.name}
              </span>
              <Chip
                size="x-small"
                variant={location.isActive ? 'success' : 'default'}
              >
                {location.isActive ? t.status.active : t.status.inactive}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField
              label={t.table.colType}
              value={
                location.type === 'warehouse' ? t.type.warehouse : t.type.store
              }
            />
            <DetailField
              label={t.table.colFulfillsOnline}
              value={
                location.fulfillsOnline ? t.status.active : t.status.inactive
              }
            />
            <DetailField label={t.form.sectionAddress} value={addressLine} />
          </div>
        </div>
      )}
    </Modal>
  )
}
