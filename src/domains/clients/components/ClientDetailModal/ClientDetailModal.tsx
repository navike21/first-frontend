import { Modal, Avatar, Chip, CountryLabel, DetailField, SectionLabel } from '@/shared/ui'
import { useConfigData, labelFor } from '@/shared/api/config'
import { useClientsTranslation } from '../../i18n'
import type { Client } from '../../model/client.types'

interface ClientDetailModalProps {
  client: Client | null
  onClose: () => void
}

export const ClientDetailModal = ({
  client,
  onClose,
}: ClientDetailModalProps) => {
  const { t, language } = useClientsTranslation()
  const { data: config } = useConfigData(
    ['industries', 'currencies', 'languages', 'documentTypes', 'clientTypes'],
    language
  )

  return (
    <Modal
      isOpen={!!client}
      onClose={onClose}
      size="lg"
      title={t.table.viewClient}
    >
      {client && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar
              alt={client.businessName}
              src={client.logoUrl}
              name={client.businessName}
              size="md"
            />
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">
                {client.businessName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">
                  {labelFor(config?.clientTypes, client.clientType)}
                </span>
                <Chip
                  size="x-small"
                  variant={client.status === 'active' ? 'success' : 'default'}
                >
                  {t.status[client.status]}
                </Chip>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField
              label={t.form.documentType}
              value={labelFor(config?.documentTypes, client.documentType)}
            />
            <DetailField
              label={t.form.documentNumber}
              value={client.documentNumber}
            />
            <DetailField
              label={t.form.country}
              value={<CountryLabel code={client.country} />}
            />
            <DetailField label={t.form.region} value={client.region} />
            <DetailField label={t.form.province} value={client.province} />
            <DetailField label={t.form.district} value={client.district} />
            <DetailField label={t.form.address} value={client.address} />
            <DetailField label={t.form.addressNumber} value={client.addressNumber} />
            <DetailField
              label={t.form.addressInterior}
              value={client.addressInterior}
            />
            <DetailField
              label={t.form.industry}
              value={labelFor(config?.industries, client.industry)}
            />
            <DetailField
              label={t.form.website}
              value={
                client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 hover:underline dark:text-primary-400"
                  >
                    {client.website}
                  </a>
                ) : undefined
              }
            />
            <DetailField label={t.form.email} value={client.email} />
            <DetailField label={t.form.phone} value={client.phone} />
            <DetailField
              label={t.form.language}
              value={labelFor(config?.languages, client.language)}
            />
            <DetailField
              label={t.form.currency}
              value={labelFor(config?.currencies, client.currency)}
            />
          </div>

          {client.primaryContact && (
            <div>
              <SectionLabel className="mb-2">{t.form.sectionContact}</SectionLabel>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailField
                  label={t.form.contactFirstName}
                  value={client.primaryContact.firstName}
                />
                <DetailField
                  label={t.form.contactLastName}
                  value={client.primaryContact.lastName}
                />
                <DetailField
                  label={t.form.contactEmail}
                  value={client.primaryContact.email}
                />
                <DetailField
                  label={t.form.contactPhone}
                  value={client.primaryContact.phone}
                />
                <DetailField
                  label={t.form.contactPosition}
                  value={client.primaryContact.position}
                />
              </div>
            </div>
          )}

          {client.notes && (
            <DetailField label={t.form.notes} value={client.notes} />
          )}
        </div>
      )}
    </Modal>
  )
}
