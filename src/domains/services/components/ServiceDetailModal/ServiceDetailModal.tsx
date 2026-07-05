import { Modal, Avatar, Chip, DetailField } from '@/shared/ui'
import { useServicesTranslation } from '../../i18n'
import type { Service } from '../../model/service.types'

interface ServiceDetailModalProps {
  service: Service | null
  onClose: () => void
}

const IconPreview = ({ src, alt }: { src: string; alt: string }) => {
  if (src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-10 w-10 rounded-md border border-border bg-surface-subtle object-contain p-1"
      />
    )
  }
  return <span className="text-sm text-foreground">{src}</span>
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
            <DetailField label={t.form.slug} value={service.slug} />
            <DetailField label={t.form.order} value={service.order} />
            {service.icon && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wide text-muted uppercase">
                  {t.form.icon}
                </span>
                <IconPreview src={service.icon} alt={service.name[language] || service.name.en} />
              </div>
            )}
            <DetailField
              label={t.form.tags}
              value={service.tags.length ? service.tags.join(', ') : undefined}
            />
            <DetailField
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
