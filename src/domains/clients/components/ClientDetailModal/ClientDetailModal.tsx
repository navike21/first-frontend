import type { ReactNode } from 'react'
import { Modal, Avatar, Chip, CountryLabel } from '@/shared/ui'
import { useConfigData, labelFor } from '@/shared/api/config'
import { useClientsTranslation } from '../../i18n'
import type { Client } from '../../model/client.types'

interface ClientDetailModalProps {
  client: Client | null
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
            <Field
              label={t.form.documentType}
              value={labelFor(config?.documentTypes, client.documentType)}
            />
            <Field
              label={t.form.documentNumber}
              value={client.documentNumber}
            />
            <Field
              label={t.form.country}
              value={<CountryLabel code={client.country} />}
            />
            <Field label={t.form.region} value={client.region} />
            <Field label={t.form.province} value={client.province} />
            <Field label={t.form.district} value={client.district} />
            <Field label={t.form.address} value={client.address} />
            <Field label={t.form.addressNumber} value={client.addressNumber} />
            <Field
              label={t.form.addressInterior}
              value={client.addressInterior}
            />
            <Field
              label={t.form.industry}
              value={labelFor(config?.industries, client.industry)}
            />
            <Field
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
            <Field label={t.form.email} value={client.email} />
            <Field label={t.form.phone} value={client.phone} />
            <Field
              label={t.form.language}
              value={labelFor(config?.languages, client.language)}
            />
            <Field
              label={t.form.currency}
              value={labelFor(config?.currencies, client.currency)}
            />
          </div>

          {client.primaryContact && (
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
                {t.form.sectionContact}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={t.form.contactFirstName}
                  value={client.primaryContact.firstName}
                />
                <Field
                  label={t.form.contactLastName}
                  value={client.primaryContact.lastName}
                />
                <Field
                  label={t.form.contactEmail}
                  value={client.primaryContact.email}
                />
                <Field
                  label={t.form.contactPhone}
                  value={client.primaryContact.phone}
                />
                <Field
                  label={t.form.contactPosition}
                  value={client.primaryContact.position}
                />
              </div>
            </div>
          )}

          {client.notes && (
            <Field label={t.form.notes} value={client.notes} />
          )}
        </div>
      )}
    </Modal>
  )
}
