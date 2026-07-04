import type { ReactNode } from 'react'
import { Modal, Avatar, Chip } from '@/shared/ui'
import { useServicesTranslation } from '../../i18n'
import type { Service } from '../../model/service.types'

interface ServiceDetailModalProps {
  service: Service | null
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

export const ServiceDetailModal = ({
  service,
  onClose,
}: ServiceDetailModalProps) => {
  const { t, language } = useServicesTranslation()

  return (
    <Modal
      isOpen={!!service}
      onClose={onClose}
      size="lg"
      title={t.table.viewService}
    >
      {service && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar
              alt={service.name[language] || service.name.en}
              src={service.coverImageUrl}
              name={service.name[language] || service.name.en}
              size="md"
            />
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">
                {service.name[language] || service.name.en}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">
                  {service.shortDescription[language] || service.shortDescription.en}
                </span>
                <Chip
                  size="x-small"
                  variant={service.status === 'active' ? 'success' : 'default'}
                >
                  {t.status[service.status]}
                </Chip>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t.form.slug} value={service.slug} />
            <Field label={t.form.order} value={service.order} />
            <Field label={t.form.icon} value={service.icon} />
            <Field
              label={t.form.tags}
              value={service.tags.length ? service.tags.join(', ') : undefined}
            />
            <Field
              label={t.form.pillars}
              value={
                service.pillars.length
                  ? service.pillars.map((p) => t.pillars[p]).join(', ')
                  : undefined
              }
            />
          </div>

          {service.description && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">
                {t.form.description}
              </span>
              <p className="text-sm text-foreground">
                {service.description[language] || service.description.en}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
