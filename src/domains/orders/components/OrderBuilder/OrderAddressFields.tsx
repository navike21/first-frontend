import type { Control, UseFormRegister } from 'react-hook-form'
import { InputField, LocationSelect, FormGrid } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { useOrdersTranslation } from '../../i18n'
import type { OrderBuilderFormData } from '../../model/order.schema'

export interface OrderAddressFieldsProps {
  control: Control<OrderBuilderFormData>
  register: UseFormRegister<OrderBuilderFormData>
  prefix: 'shippingAddress' | 'billingAddress'
  language: Language
}

export const OrderAddressFields = ({
  control,
  register,
  prefix,
  language,
}: OrderAddressFieldsProps) => {
  const { t } = useOrdersTranslation()

  return (
    <div className="flex flex-col gap-4">
      <LocationSelect
        control={control}
        names={{
          countryCode: `${prefix}.country`,
          ubigeoCode: `${prefix}.ubigeoCode`,
          region: `${prefix}.region`,
          province: `${prefix}.province`,
          district: `${prefix}.district`,
        }}
        countryLabel={t.builder.country}
        regionLabel={t.builder.region}
        cityLabel={t.builder.province}
        lang={language}
      />

      <FormGrid>
        <InputField
          label={t.builder.address}
          autoComplete="address-line1"
          {...register(`${prefix}.address`)}
        />
        <InputField
          label={t.builder.addressNumber}
          autoComplete="off"
          {...register(`${prefix}.addressNumber`)}
        />
        <InputField
          label={t.builder.addressInterior}
          autoComplete="address-line2"
          {...register(`${prefix}.addressInterior`)}
        />
      </FormGrid>
    </div>
  )
}
