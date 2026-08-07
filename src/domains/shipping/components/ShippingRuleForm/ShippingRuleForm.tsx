import { useEffect, useMemo } from 'react'
import { useForm, useFieldArray, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputNumber,
  PriceInput,
  Select,
  Switch,
  Button,
  ButtonGroup,
  FormGrid,
  SectionLabel,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { currencySymbol } from '@/shared/lib/formatCurrency'
import { useShippingTranslation } from '../../i18n'
import { createShippingRuleSchema } from '../../model/shippingRule.schema'
import type { ShippingRuleFormData } from '../../model/shippingRule.schema'
import { ShippingZoneRow } from './ShippingZoneRow'

export interface ShippingRuleFormProps {
  mode: 'create' | 'edit'
  currency: string
  initialValues?: Partial<ShippingRuleFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: ShippingRuleFormData) => void
}

export const ShippingRuleForm = ({
  mode,
  currency,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: ShippingRuleFormProps) => {
  const { t, language } = useShippingTranslation()
  const schema = useMemo(() => createShippingRuleSchema(t.validation), [t.validation])

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<ShippingRuleFormData>({
    resolver: zodResolver(schema) as Resolver<ShippingRuleFormData>,
    mode: 'onTouched',
    defaultValues: {
      name: '',
      type: 'flat',
      amount: '',
      freeOverAmount: '',
      zones: [],
      isActive: true,
      order: '0',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const { fields: zoneFields, append: appendZone, remove: removeZone } = useFieldArray({
    control,
    name: 'zones',
  })

  const typeValue = useWatch({ control, name: 'type' })
  const isActiveValue = useWatch({ control, name: 'isActive' })

  const typeOptions = [
    { value: 'flat', label: t.type.flat },
    { value: 'free_over_threshold', label: t.type.free_over_threshold },
    { value: 'by_zone', label: t.type.by_zone },
  ]

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
        <FormGrid>
          <InputField
            label={requiredLabel(t.form.name)}
            variant={errors.name ? 'error' : undefined}
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <Select
            label={t.form.type}
            options={typeOptions}
            value={typeValue}
            lang={language}
            onChange={(e) =>
              setValue(
                'type',
                e.target.value as ShippingRuleFormData['type'],
                { shouldValidate: true, shouldDirty: true, shouldTouch: true }
              )
            }
          />
        </FormGrid>

        <FormGrid>
          <PriceInput
            label={requiredLabel(t.form.amount)}
            helperText={t.form.amountHint}
            prefix={currencySymbol(currency, language)}
            variant={errors.amount ? 'error' : undefined}
            errorMessage={errors.amount?.message}
            {...register('amount')}
          />
          <InputNumber label={t.form.order} min={0} {...register('order')} />
        </FormGrid>

        {typeValue === 'free_over_threshold' && (
          <PriceInput
            label={requiredLabel(t.form.freeOverAmount)}
            helperText={t.form.freeOverAmountHint}
            prefix={currencySymbol(currency, language)}
            variant={errors.freeOverAmount ? 'error' : undefined}
            errorMessage={errors.freeOverAmount?.message}
            {...register('freeOverAmount')}
          />
        )}

        {typeValue === 'by_zone' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <SectionLabel>{t.form.zones}</SectionLabel>
                <p className="text-secondary text-sm">{t.form.zonesHint}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => appendZone({ region: '', provincesText: '' })}
              >
                {t.form.addZone}
              </Button>
            </div>
            {errors.zones && !Array.isArray(errors.zones) && (
              <p className="text-danger-600 text-sm">{errors.zones.message}</p>
            )}
            {zoneFields.length > 0 && (
              <div className="flex flex-col gap-3">
                {zoneFields.map((field, index) => (
                  <ShippingZoneRow
                    key={field.id}
                    index={index}
                    register={register}
                    onRemove={() => removeZone(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <Switch
          label={t.form.isActive}
          checked={isActiveValue}
          onChange={(e) =>
            setValue('isActive', e.target.checked, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
          disabled={isSubmitting}
        />

        <ButtonGroup className="border-border border-t pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t.form.cancel}
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={isSubmitting}
            onClick={() => {
              void submit()
            }}
          >
            {mode === 'create' ? t.form.create : t.form.save}
          </Button>
        </ButtonGroup>
      </div>
    </form>
  )
}
