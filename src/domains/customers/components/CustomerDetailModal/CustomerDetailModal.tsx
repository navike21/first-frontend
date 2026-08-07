import { Modal, Chip, DetailField } from '@/shared/ui'
import { useCustomersTranslation } from '../../i18n'
import type { Customer } from '../../model/customer.types'

interface CustomerDetailModalProps {
  customer: Customer | null
  onClose: () => void
}

export const CustomerDetailModal = ({
  customer,
  onClose,
}: CustomerDetailModalProps) => {
  const { t } = useCustomersTranslation()

  return (
    <Modal
      isOpen={!!customer}
      onClose={onClose}
      size="lg"
      title={t.table.viewCustomer}
    >
      {customer && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-base font-bold">
                {customer.firstName} {customer.lastName}
              </span>
              <Chip
                size="x-small"
                variant={customer.status === 'active' ? 'success' : 'default'}
              >
                {customer.status === 'active'
                  ? t.status.active
                  : t.status.inactive}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.table.colEmail} value={customer.email} />
            <DetailField
              label={t.table.colPhone}
              value={customer.phone || '—'}
            />
            <DetailField
              label={t.form.documentType}
              value={customer.documentType || t.form.documentTypeNone}
            />
            <DetailField
              label={t.form.documentNumber}
              value={customer.documentNumber || '—'}
            />
          </div>

          {customer.notes && (
            <DetailField label={t.form.notes} value={customer.notes} />
          )}

          {customer.addresses.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-secondary text-sm font-medium">
                {t.form.sectionAddresses}
              </span>
              <div className="flex flex-col gap-2">
                {customer.addresses.map((address) => (
                  <div
                    key={address.addressId}
                    className="border-border bg-surface-subtle flex flex-col gap-1 rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Chip size="x-small">
                        {address.type === 'shipping'
                          ? t.form.addressTypeShipping
                          : t.form.addressTypeBilling}
                      </Chip>
                      {address.isDefault && (
                        <Chip size="x-small" variant="success">
                          {t.form.addressIsDefault}
                        </Chip>
                      )}
                    </div>
                    <span className="text-secondary">
                      {[
                        address.address,
                        address.addressNumber,
                        address.addressInterior,
                        address.district,
                        address.province,
                        address.region,
                        address.country,
                      ]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
