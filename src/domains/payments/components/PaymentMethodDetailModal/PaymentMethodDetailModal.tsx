import { Modal, Chip, DetailField } from '@/shared/ui'
import { usePaymentsTranslation } from '../../i18n'
import { useCustomersForPaymentPicker } from '../../api/paymentMethods.queries'
import type { PaymentMethod } from '../../model/payment.types'

interface PaymentMethodDetailModalProps {
  method: PaymentMethod | null
  onClose: () => void
}

export const PaymentMethodDetailModal = ({
  method,
  onClose,
}: PaymentMethodDetailModalProps) => {
  const { t } = usePaymentsTranslation()
  const { data: customers } = useCustomersForPaymentPicker()

  const customerName = (() => {
    if (!method) return ''
    const customer = customers?.find((c) => c.id === method.customerId)
    return customer ? `${customer.firstName} ${customer.lastName}` : method.customerId
  })()

  return (
    <Modal isOpen={!!method} onClose={onClose} size="lg" title={t.table.viewMethod}>
      {method && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground font-mono text-base font-bold">
                {method.brand} •••• {method.last4}
              </span>
              <Chip size="x-small" variant={method.isDefault ? 'success' : 'default'}>
                {method.isDefault ? t.status.yes : t.status.no}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.table.colCustomer} value={customerName} />
            <DetailField label={t.table.colProvider} value={method.provider} />
            <DetailField
              label={t.table.colExpiry}
              value={`${String(method.expiryMonth).padStart(2, '0')}/${method.expiryYear}`}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
