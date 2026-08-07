import { useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputNumber,
  Select,
  Switch,
  Button,
  ButtonGroup,
  FormGrid,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { usePaymentsTranslation } from '../../i18n'
import { useCustomersForPaymentPicker } from '../../api/paymentMethods.queries'
import {
  createPaymentMethodSchema,
  PAYMENT_PROVIDER_KEYS,
} from '../../model/paymentMethod.schema'
import type { PaymentMethodFormData } from '../../model/paymentMethod.schema'

export interface PaymentMethodFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<PaymentMethodFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: PaymentMethodFormData) => void
}

export const PaymentMethodForm = ({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: PaymentMethodFormProps) => {
  const { t, language } = usePaymentsTranslation()
  const schema = useMemo(() => createPaymentMethodSchema(t.validation), [t.validation])
  const { data: customers } = useCustomersForPaymentPicker()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(schema) as Resolver<PaymentMethodFormData>,
    mode: 'onTouched',
    defaultValues: {
      customerId: '',
      provider: 'manual',
      providerToken: '',
      brand: '',
      last4: '',
      expiryMonth: '',
      expiryYear: '',
      isDefault: false,
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const customerIdValue = useWatch({ control, name: 'customerId' })
  const providerValue = useWatch({ control, name: 'provider' })
  const isDefaultValue = useWatch({ control, name: 'isDefault' })

  const customerOptions = (customers ?? []).map((c) => ({
    value: c.id,
    label: `${c.firstName} ${c.lastName} (${c.email})`,
  }))
  const providerOptions = PAYMENT_PROVIDER_KEYS.map((provider) => ({
    value: provider,
    label: provider,
  }))

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
        <Select
          label={requiredLabel(t.form.customerId)}
          options={customerOptions}
          value={customerIdValue}
          lang={language}
          variant={errors.customerId ? 'error' : undefined}
          errorMessage={errors.customerId?.message}
          onChange={(e) =>
            setValue('customerId', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        />

        <FormGrid>
          <Select
            label={t.form.provider}
            options={providerOptions}
            value={providerValue}
            lang={language}
            onChange={(e) =>
              setValue(
                'provider',
                e.target.value as PaymentMethodFormData['provider'],
                { shouldValidate: true, shouldDirty: true, shouldTouch: true }
              )
            }
          />
          <InputField
            label={requiredLabel(t.form.providerToken)}
            helperText={t.form.providerTokenHint}
            variant={errors.providerToken ? 'error' : undefined}
            errorMessage={errors.providerToken?.message}
            {...register('providerToken')}
          />
        </FormGrid>

        <FormGrid>
          <InputField
            label={requiredLabel(t.form.brand)}
            variant={errors.brand ? 'error' : undefined}
            errorMessage={errors.brand?.message}
            {...register('brand')}
          />
          <InputField
            label={requiredLabel(t.form.last4)}
            maxLength={4}
            variant={errors.last4 ? 'error' : undefined}
            errorMessage={errors.last4?.message}
            {...register('last4')}
          />
        </FormGrid>

        <FormGrid>
          <InputNumber
            label={requiredLabel(t.form.expiryMonth)}
            min={1}
            max={12}
            variant={errors.expiryMonth ? 'error' : undefined}
            errorMessage={errors.expiryMonth?.message}
            {...register('expiryMonth')}
          />
          <InputNumber
            label={requiredLabel(t.form.expiryYear)}
            min={2000}
            max={2999}
            variant={errors.expiryYear ? 'error' : undefined}
            errorMessage={errors.expiryYear?.message}
            {...register('expiryYear')}
          />
        </FormGrid>

        <Switch
          label={t.form.isDefault}
          checked={isDefaultValue}
          onChange={(e) =>
            setValue('isDefault', e.target.checked, {
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
