import type { UseFormRegister } from 'react-hook-form'
import { InputField, IconButton, Tooltip, FormGrid } from '@/shared/ui'
import { useShippingTranslation } from '../../i18n'
import type { ShippingRuleFormData } from '../../model/shippingRule.schema'

export interface ShippingZoneRowProps {
  index: number
  register: UseFormRegister<ShippingRuleFormData>
  onRemove: () => void
}

export const ShippingZoneRow = ({ index, register, onRemove }: ShippingZoneRowProps) => {
  const { t } = useShippingTranslation()

  return (
    <div className="border-border bg-surface-subtle flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-foreground text-sm font-semibold">
          {t.form.zones} {index + 1}
        </span>
        <Tooltip heading={t.form.removeZone} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={t.form.removeZone}
            onClick={onRemove}
          />
        </Tooltip>
      </div>
      <FormGrid>
        <InputField
          label={t.form.zoneRegion}
          {...register(`zones.${index}.region`)}
        />
        <InputField
          label={t.form.zoneProvinces}
          helperText={t.form.zoneProvincesHint}
          {...register(`zones.${index}.provincesText`)}
        />
      </FormGrid>
    </div>
  )
}
