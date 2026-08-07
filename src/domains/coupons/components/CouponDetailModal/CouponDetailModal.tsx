import { Modal, Chip, DetailField } from '@/shared/ui'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { formatDate } from '@/shared/lib/formatDate'
import { useCouponsTranslation } from '../../i18n'
import type { Coupon } from '../../model/coupon.types'

interface CouponDetailModalProps {
  coupon: Coupon | null
  currency: string
  onClose: () => void
}

export const CouponDetailModal = ({
  coupon,
  currency,
  onClose,
}: CouponDetailModalProps) => {
  const { t, language } = useCouponsTranslation()

  function formatValueDisplay(): string {
    if (!coupon) return ''
    if (coupon.type === 'percentage') return `${coupon.value}%`
    return formatCurrency(coupon.value, currency, language)
  }

  const valueDisplay = formatValueDisplay()

  return (
    <Modal isOpen={!!coupon} onClose={onClose} size="lg" title={t.table.viewCoupon}>
      {coupon && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground font-mono text-base font-bold">
                {coupon.code}
              </span>
              <Chip
                size="x-small"
                variant={coupon.status === 'active' ? 'success' : 'default'}
              >
                {coupon.status === 'active' ? t.status.active : t.status.inactive}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.table.colType} value={t.type[coupon.type]} />
            <DetailField label={t.table.colValue} value={valueDisplay} />
            {coupon.maxDiscountAmount && (
              <DetailField
                label={t.form.maxDiscountAmount}
                value={formatCurrency(
                  coupon.maxDiscountAmount.amount,
                  coupon.maxDiscountAmount.currency,
                  language
                )}
              />
            )}
            <DetailField label={t.form.scopeType} value={t.scope[coupon.scope.type]} />
            <DetailField
              label={t.form.timesUsed}
              value={
                coupon.usageLimitTotal
                  ? `${coupon.timesUsed} / ${coupon.usageLimitTotal}`
                  : String(coupon.timesUsed)
              }
            />
            {coupon.usageLimitPerCustomer && (
              <DetailField
                label={t.form.usageLimitPerCustomer}
                value={String(coupon.usageLimitPerCustomer)}
              />
            )}
            {coupon.startsAt && (
              <DetailField label={t.form.startsAt} value={formatDate(coupon.startsAt)} />
            )}
            {coupon.expiresAt && (
              <DetailField label={t.form.expiresAt} value={formatDate(coupon.expiresAt)} />
            )}
            <DetailField
              label={t.form.isStackable}
              value={coupon.isStackable ? t.status.active : t.status.inactive}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
