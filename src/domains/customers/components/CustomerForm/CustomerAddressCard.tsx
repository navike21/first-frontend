import type { Control, UseFormRegister } from 'react-hook-form'
import {
  InputField,
  Select,
  Switch,
  IconButton,
  LocationSelect,
  FormGrid,
  Tooltip,
} from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { useCustomersTranslation } from '../../i18n'
import type { CustomerFormData } from '../../model/customer.schema'

export interface CustomerAddressCardProps {
  index: number
  control: Control<CustomerFormData>
  register: UseFormRegister<CustomerFormData>
  language: Language
  typeValue: 'shipping' | 'billing'
  isDefaultValue: boolean
  onTypeChange: (value: 'shipping' | 'billing') => void
  onIsDefaultChange: (value: boolean) => void
  onRemove: () => void
}

export const CustomerAddressCard = ({
  index,
  control,
  language,
  register,
  typeValue,
  isDefaultValue,
  onTypeChange,
  onIsDefaultChange,
  onRemove,
}: CustomerAddressCardProps) => {
  const { t } = useCustomersTranslation()

  const typeOptions = [
    { value: 'shipping', label: t.form.addressTypeShipping },
    { value: 'billing', label: t.form.addressTypeBilling },
  ]

  return (
    <div className="border-border bg-surface-subtle flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-foreground text-sm font-semibold">
          {t.form.addressLabel(index + 1)}
        </span>
        <Tooltip heading={t.form.removeAddress} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={t.form.removeAddress}
            onClick={onRemove}
          />
        </Tooltip>
      </div>

      <FormGrid>
        <Select
          label={t.form.addressType}
          options={typeOptions}
          value={typeValue}
          lang={language}
          onChange={(e) =>
            onTypeChange(e.target.value as 'shipping' | 'billing')
          }
        />
        <Switch
          label={t.form.addressIsDefault}
          checked={isDefaultValue}
          onChange={(e) => onIsDefaultChange(e.target.checked)}
        />
      </FormGrid>

      <LocationSelect
        control={control}
        names={{
          countryCode: `addresses.${index}.country`,
          ubigeoCode: `addresses.${index}.ubigeoCode`,
          region: `addresses.${index}.region`,
          province: `addresses.${index}.province`,
          district: `addresses.${index}.district`,
        }}
        countryLabel={t.form.country}
        regionLabel={t.form.region}
        cityLabel={t.form.province}
        lang={language}
      />

      <FormGrid>
        <InputField
          label={t.form.address}
          autoComplete="address-line1"
          {...register(`addresses.${index}.address`)}
        />
        <InputField
          label={t.form.addressNumber}
          autoComplete="off"
          {...register(`addresses.${index}.addressNumber`)}
        />
        <InputField
          label={t.form.addressInterior}
          autoComplete="address-line2"
          {...register(`addresses.${index}.addressInterior`)}
        />
      </FormGrid>
    </div>
  )
}
