import { Modal, Chip, DetailField } from '@/shared/ui'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { useShippingTranslation } from '../../i18n'
import type { ShippingRule } from '../../model/shippingRule.types'

interface ShippingRuleDetailModalProps {
  rule: ShippingRule | null
  onClose: () => void
}

export const ShippingRuleDetailModal = ({
  rule,
  onClose,
}: ShippingRuleDetailModalProps) => {
  const { t, language } = useShippingTranslation()

  return (
    <Modal isOpen={!!rule} onClose={onClose} size="lg" title={t.table.viewRule}>
      {rule && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-base font-bold">{rule.name}</span>
              <Chip size="x-small" variant={rule.isActive ? 'success' : 'default'}>
                {rule.isActive ? t.status.active : t.status.inactive}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.table.colType} value={t.type[rule.type]} />
            <DetailField
              label={t.form.amount}
              value={formatCurrency(rule.amount.amount, rule.amount.currency, language)}
            />
            {rule.freeOverAmount && (
              <DetailField
                label={t.form.freeOverAmount}
                value={formatCurrency(
                  rule.freeOverAmount.amount,
                  rule.freeOverAmount.currency,
                  language
                )}
              />
            )}
            <DetailField label={t.form.order} value={String(rule.order)} />
          </div>

          {rule.zones.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-foreground text-sm font-semibold">
                {t.form.zones}
              </span>
              <ul className="flex flex-col gap-1">
                {rule.zones.map((zone) => (
                  <li key={zone.region} className="text-secondary text-sm">
                    {zone.region}
                    {zone.provinces && zone.provinces.length > 0
                      ? ` (${zone.provinces.join(', ')})`
                      : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
