import { useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
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
import { useCouponsTranslation } from '../../i18n'
import {
  useProductsForCouponPicker,
  useProductCategoriesForCouponPicker,
} from '../../api/coupons.queries'
import { createCouponSchema } from '../../model/coupon.schema'
import type { CouponFormData } from '../../model/coupon.schema'

export interface CouponFormProps {
  mode: 'create' | 'edit'
  currency: string
  timesUsed?: number
  initialValues?: Partial<CouponFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: CouponFormData) => void
}

export const CouponForm = ({
  mode,
  currency,
  timesUsed,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: CouponFormProps) => {
  const { t, language } = useCouponsTranslation()
  const schema = useMemo(() => createCouponSchema(t.validation), [t.validation])
  const { data: products } = useProductsForCouponPicker()
  const { data: categories } = useProductCategoriesForCouponPicker()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(schema) as Resolver<CouponFormData>,
    mode: 'onTouched',
    defaultValues: {
      code: '',
      type: 'percentage',
      value: '',
      maxDiscountAmount: '',
      usageLimitTotal: '',
      usageLimitPerCustomer: '',
      startsAt: '',
      expiresAt: '',
      isStackable: false,
      scopeType: 'cart',
      targetIds: [],
      status: 'active',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const typeValue = useWatch({ control, name: 'type' })
  const scopeTypeValue = useWatch({ control, name: 'scopeType' })
  const targetIdsValue = useWatch({ control, name: 'targetIds' })
  const isStackableValue = useWatch({ control, name: 'isStackable' })
  const statusValue = useWatch({ control, name: 'status' })

  const typeOptions = [
    { value: 'percentage', label: t.type.percentage },
    { value: 'fixed', label: t.type.fixed },
  ]
  const scopeOptions = [
    { value: 'cart', label: t.scope.cart },
    { value: 'products', label: t.scope.products },
    { value: 'categories', label: t.scope.categories },
  ]
  const statusOptions = [
    { value: 'active', label: t.status.active },
    { value: 'inactive', label: t.status.inactive },
  ]

  const targetOptions =
    scopeTypeValue === 'products'
      ? (products ?? []).map((p) => ({
          value: p.id,
          label: p.name[language] || p.name.en,
        }))
      : (categories ?? []).map((c) => ({
          value: c.id,
          label: c.name[language] || c.name.en,
        }))

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
        <FormGrid>
          <InputField
            label={requiredLabel(t.form.code)}
            variant={errors.code ? 'error' : undefined}
            errorMessage={errors.code?.message}
            {...register('code')}
          />
          <Select
            label={t.form.type}
            options={typeOptions}
            value={typeValue}
            lang={language}
            onChange={(e) =>
              setValue('type', e.target.value as CouponFormData['type'], {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
        </FormGrid>

        <FormGrid>
          {typeValue === 'fixed' ? (
            <PriceInput
              label={requiredLabel(t.form.value)}
              helperText={t.form.valueFixedHint}
              prefix={currencySymbol(currency, language)}
              variant={errors.value ? 'error' : undefined}
              errorMessage={errors.value?.message}
              {...register('value')}
            />
          ) : (
            <InputNumber
              label={requiredLabel(t.form.value)}
              helperText={t.form.valuePercentageHint}
              min={0}
              max={100}
              decimals={2}
              variant={errors.value ? 'error' : undefined}
              errorMessage={errors.value?.message}
              {...register('value')}
            />
          )}
          {typeValue === 'percentage' && (
            <PriceInput
              label={t.form.maxDiscountAmount}
              helperText={t.form.maxDiscountAmountHint}
              prefix={currencySymbol(currency, language)}
              {...register('maxDiscountAmount')}
            />
          )}
        </FormGrid>

        <FormGrid>
          <InputNumber
            label={t.form.usageLimitTotal}
            min={1}
            {...register('usageLimitTotal')}
          />
          <InputNumber
            label={t.form.usageLimitPerCustomer}
            min={1}
            {...register('usageLimitPerCustomer')}
          />
        </FormGrid>

        <FormGrid>
          <InputField
            type="datetime-local"
            label={t.form.startsAt}
            {...register('startsAt')}
          />
          <InputField
            type="datetime-local"
            label={t.form.expiresAt}
            variant={errors.expiresAt ? 'error' : undefined}
            errorMessage={errors.expiresAt?.message}
            {...register('expiresAt')}
          />
        </FormGrid>

        <div className="flex flex-col gap-3">
          <SectionLabel>{t.form.scopeType}</SectionLabel>
          <Select
            options={scopeOptions}
            value={scopeTypeValue}
            lang={language}
            onChange={(e) => {
              setValue(
                'scopeType',
                e.target.value as CouponFormData['scopeType'],
                { shouldValidate: true, shouldDirty: true, shouldTouch: true }
              )
              setValue('targetIds', [], { shouldValidate: true })
            }}
          />
          {scopeTypeValue !== 'cart' && (
            <Select
              label={
                scopeTypeValue === 'products'
                  ? t.form.targetIdsProducts
                  : t.form.targetIdsCategories
              }
              multiple
              options={targetOptions}
              value={targetIdsValue ?? []}
              lang={language}
              variant={errors.targetIds ? 'error' : undefined}
              errorMessage={(errors.targetIds as { message?: string })?.message}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                )
                setValue('targetIds', selected, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }}
            />
          )}
        </div>

        <FormGrid>
          <Switch
            label={t.form.isStackable}
            checked={isStackableValue}
            onChange={(e) =>
              setValue('isStackable', e.target.checked, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            disabled={isSubmitting}
          />
          <Select
            label={t.form.status}
            options={statusOptions}
            value={statusValue}
            lang={language}
            onChange={(e) =>
              setValue('status', e.target.value as CouponFormData['status'], {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
        </FormGrid>

        {mode === 'edit' && timesUsed !== undefined && (
          <p className="text-secondary text-sm">
            {t.form.timesUsed}: {timesUsed}
          </p>
        )}

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
