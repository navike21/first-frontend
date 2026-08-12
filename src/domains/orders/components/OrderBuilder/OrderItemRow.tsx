import type { UseFormRegister } from 'react-hook-form'
import { InputNumber, IconButton, Tooltip } from '@/shared/ui'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import type { Language } from '@/shared/i18n'
import { useOrdersTranslation } from '../../i18n'
import type { OrderBuilderFormData, OrderBuilderItemFormData } from '../../model/order.schema'

export interface OrderItemRowProps {
  index: number
  item: OrderBuilderItemFormData
  register: UseFormRegister<OrderBuilderFormData>
  language: Language
  onRemove: () => void
}

export const OrderItemRow = ({ index, item, register, language, onRemove }: OrderItemRowProps) => {
  const { t } = useOrdersTranslation()
  const quantity = Number.parseInt(item.quantity, 10) || 0
  const lineTotal = item.unitPriceAmount * quantity

  return (
    <div className="border-border bg-surface-subtle flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-foreground truncate text-sm font-semibold">
          {item.nameSnapshot}
          {item.skuSnapshot && (
            <span className="text-muted ml-2 font-mono text-xs">{item.skuSnapshot}</span>
          )}
        </span>
        <span className="text-secondary text-xs">
          {formatCurrency(item.unitPriceAmount, item.currency, language)} {t.builder.colUnitPrice.toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <InputNumber
          label={t.builder.quantityLabel}
          className="w-24"
          min={1}
          {...register(`items.${index}.quantity`)}
        />
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-muted text-xs">{t.builder.colLineTotal}</span>
          <span className="text-foreground text-sm font-semibold">
            {formatCurrency(lineTotal, item.currency, language)}
          </span>
        </div>
        <Tooltip heading={t.builder.removeItem} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={t.builder.removeItem}
            onClick={onRemove}
          />
        </Tooltip>
      </div>
    </div>
  )
}
