import { useMemo, useState } from 'react'
import { useForm, useFieldArray, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputNumber,
  Select,
  Switch,
  Button,
  Wizard,
  SectionLabel,
  SectionDivider,
  type WizardStep,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { useOrdersTranslation } from '../../i18n'
import {
  useCustomersForOrderPicker,
  useLocationsForOrderPicker,
  useProductsForOrderPicker,
} from '../../api/orders.queries'
import { createOrderBuilderSchema, estimateSubtotal } from '../../model/order.schema'
import type { OrderBuilderFormData, OrderBuilderItemFormData } from '../../model/order.schema'
import { OrderItemRow } from './OrderItemRow'
import { OrderAddressFields } from './OrderAddressFields'

export interface OrderBuilderFormProps {
  currency: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: OrderBuilderFormData) => void
}

type StepId = 'customer' | 'items' | 'shipping' | 'review'

const STEP_FIELDS: Record<StepId, (keyof OrderBuilderFormData)[]> = {
  customer: ['customerId', 'fulfillmentLocationId'],
  items: ['items'],
  shipping: ['shippingAddress', 'billingAddress', 'couponCode'],
  review: [],
}

const emptyAddress = {
  country: '',
  ubigeoCode: '',
  region: '',
  province: '',
  district: '',
  address: '',
  addressNumber: '',
  addressInterior: '',
}

export const OrderBuilderForm = ({
  currency,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: OrderBuilderFormProps) => {
  const { t, language } = useOrdersTranslation()
  const schema = useMemo(() => createOrderBuilderSchema(t.validation), [t.validation])

  const { data: customers } = useCustomersForOrderPicker()
  const { data: locations } = useLocationsForOrderPicker()
  const { data: products } = useProductsForOrderPicker()

  const [activeStep, setActiveStep] = useState<StepId>('customer')
  const [maxStep, setMaxStep] = useState(0)
  const [stagingProductId, setStagingProductId] = useState('')
  const [stagingVariantId, setStagingVariantId] = useState('')
  const [stagingQuantity, setStagingQuantity] = useState('1')
  // `InputNumber` is uncontrolled (defaultValue only) — bumping this key
  // forces a remount so the field visibly resets to "1" after each add.
  const [stagingQuantityResetKey, setStagingQuantityResetKey] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    trigger,
    control,
    formState: { errors },
  } = useForm<OrderBuilderFormData>({
    resolver: zodResolver(schema) as Resolver<OrderBuilderFormData>,
    mode: 'onTouched',
    defaultValues: {
      customerId: '',
      fulfillmentLocationId: '',
      items: [],
      couponCode: '',
      shippingAddress: { ...emptyAddress },
      sameBillingAddress: true,
      billingAddress: { ...emptyAddress },
      notes: '',
    },
  })

  useMemo(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const { fields: itemFields, append: appendItem, remove: removeItem, update: updateItem } =
    useFieldArray({ control, name: 'items' })

  const customerIdValue = useWatch({ control, name: 'customerId' })
  const locationIdValue = useWatch({ control, name: 'fulfillmentLocationId' })
  const itemsValue = useWatch({ control, name: 'items' })
  const sameBillingValue = useWatch({ control, name: 'sameBillingAddress' })
  const couponCodeValue = useWatch({ control, name: 'couponCode' })

  const customerOptions = useMemo(
    () =>
      (customers ?? []).map((c) => ({
        value: c.id,
        label: `${c.firstName} ${c.lastName} (${c.email})`,
      })),
    [customers]
  )

  const locationOptions = useMemo(
    () => (locations ?? []).map((l) => ({ value: l.id, label: l.name })),
    [locations]
  )

  const productOptions = useMemo(
    () =>
      (products ?? []).map((p) => ({
        value: p.id,
        label: `${p.name[language] || p.name.en} — ${formatCurrency(p.price.amount, p.price.currency, language)}`,
      })),
    [products, language]
  )

  const stagingProduct = (products ?? []).find((p) => p.id === stagingProductId)

  const variantOptions = useMemo(
    () =>
      (stagingProduct?.variants ?? []).map((v) => ({
        value: v.id,
        label: `${Object.values(v.optionValues).join(' / ')} — ${formatCurrency(v.price.amount, v.price.currency, language)}`,
      })),
    [stagingProduct, language]
  )

  const selectedCustomer = (customers ?? []).find((c) => c.id === customerIdValue)
  const selectedLocation = (locations ?? []).find((l) => l.id === locationIdValue)

  const canAddItem =
    !!stagingProduct &&
    (!stagingProduct.hasVariants || !!stagingVariantId) &&
    Number.parseInt(stagingQuantity, 10) > 0

  const handleAddItem = () => {
    if (!stagingProduct || !canAddItem) return

    const variant = stagingProduct.hasVariants
      ? stagingProduct.variants.find((v) => v.id === stagingVariantId)
      : undefined
    const unitPriceAmount = variant ? variant.price.amount : stagingProduct.price.amount
    const itemCurrency = variant ? variant.price.currency : stagingProduct.price.currency
    const skuSnapshot = variant?.sku ?? stagingProduct.sku
    const nameSnapshot = stagingProduct.name[language] || stagingProduct.name.en
    const addQty = Number.parseInt(stagingQuantity, 10) || 1

    const existingIndex = itemFields.findIndex(
      (f) => f.productId === stagingProduct.id && (f.variantId ?? '') === (stagingVariantId || '')
    )

    if (existingIndex >= 0) {
      const existing = itemFields[existingIndex] as OrderBuilderItemFormData
      const nextQty = (Number.parseInt(existing.quantity, 10) || 0) + addQty
      updateItem(existingIndex, { ...existing, quantity: String(nextQty) })
    } else {
      appendItem({
        productId: stagingProduct.id,
        variantId: stagingVariantId || undefined,
        nameSnapshot,
        skuSnapshot,
        unitPriceAmount,
        currency: itemCurrency,
        quantity: String(addQty),
      })
    }

    setStagingProductId('')
    setStagingVariantId('')
    setStagingQuantity('1')
    setStagingQuantityResetKey((k) => k + 1)
  }

  const stepHasError = (step: StepId) =>
    STEP_FIELDS[step].some((f) => f in errors)

  const steps: WizardStep[] = [
    { id: 'customer', label: t.builder.stepCustomer, error: stepHasError('customer') },
    { id: 'items', label: t.builder.stepItems, error: stepHasError('items') },
    { id: 'shipping', label: t.builder.stepShipping, error: stepHasError('shipping') },
    { id: 'review', label: t.builder.stepReview },
  ]

  const reachedIndex = maxStep

  const handleNext = async () => {
    const ok = await trigger(STEP_FIELDS[activeStep])
    if (!ok) return
    const i = steps.findIndex((s) => s.id === activeStep)
    if (i < steps.length - 1) {
      const next = i + 1
      setActiveStep(steps[next].id as StepId)
      setMaxStep((m) => Math.max(m, next))
    }
  }

  const handleBack = () => {
    const i = steps.findIndex((s) => s.id === activeStep)
    if (i > 0) setActiveStep(steps[i - 1].id as StepId)
  }

  const submit = handleSubmit(
    (data) => onSubmit(data),
    (formErrors) => {
      for (const step of ['customer', 'items', 'shipping'] as StepId[]) {
        if (STEP_FIELDS[step].some((f) => f in formErrors)) {
          setActiveStep(step)
          break
        }
      }
    }
  )

  const estimatedSubtotal = estimateSubtotal(itemsValue ?? [])
  const itemsErrorMessage =
    errors.items && !Array.isArray(errors.items)
      ? (errors.items as unknown as { message?: string }).message
      : undefined

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface rounded-xl border p-6 sm:p-8">
        <Wizard
          steps={steps}
          current={activeStep}
          reachedIndex={reachedIndex}
          onStepChange={(id) => setActiveStep(id as StepId)}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={submit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          backLabel={t.builder.back}
          nextLabel={t.builder.next}
          submitLabel={t.builder.create}
          cancelLabel={t.builder.cancel}
          optionalLabel={t.builder.optional}
        >
          {/* Step 1 — Customer & location */}
          <div hidden={activeStep !== 'customer'} className="animate-tab-fade flex flex-col gap-6">
            <Select
              label={requiredLabel(t.builder.customerLabel)}
              placeholder={t.builder.customerPlaceholder}
              options={customerOptions}
              value={customerIdValue}
              lang={language}
              search
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
            <Select
              label={requiredLabel(t.builder.locationLabel)}
              placeholder={t.builder.locationPlaceholder}
              options={locationOptions}
              value={locationIdValue}
              lang={language}
              variant={errors.fulfillmentLocationId ? 'error' : undefined}
              errorMessage={errors.fulfillmentLocationId?.message}
              onChange={(e) =>
                setValue('fulfillmentLocationId', e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          </div>

          {/* Step 2 — Items */}
          <div hidden={activeStep !== 'items'} className="animate-tab-fade flex flex-col gap-6">
            <div className="border-border-control flex flex-col gap-3 rounded-lg border border-dashed p-4">
              <SectionLabel>{t.builder.addItem}</SectionLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_2fr_1fr_auto] sm:items-end">
                <Select
                  label={t.builder.productLabel}
                  placeholder={t.builder.productPlaceholder}
                  options={productOptions}
                  value={stagingProductId}
                  lang={language}
                  search
                  onChange={(e) => {
                    setStagingProductId(e.target.value)
                    setStagingVariantId('')
                  }}
                />
                {stagingProduct?.hasVariants ? (
                  <Select
                    label={t.builder.variantLabel}
                    options={variantOptions}
                    value={stagingVariantId}
                    lang={language}
                    onChange={(e) => setStagingVariantId(e.target.value)}
                  />
                ) : (
                  <div />
                )}
                <InputNumber
                  key={stagingQuantityResetKey}
                  label={t.builder.quantityLabel}
                  min={1}
                  defaultValue={stagingQuantity}
                  onChange={(e) => setStagingQuantity(e.target.value)}
                />
                <Button type="button" variant="secondary" disabled={!canAddItem} onClick={handleAddItem}>
                  {t.builder.addItem}
                </Button>
              </div>
            </div>

            {itemsErrorMessage && <p className="text-danger-600 text-sm">{itemsErrorMessage}</p>}

            {itemFields.length === 0 ? (
              <p className="text-secondary text-sm">{t.builder.itemsEmpty}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {itemFields.map((field, index) => (
                  <OrderItemRow
                    key={field.id}
                    index={index}
                    item={itemsValue?.[index] ?? (field as unknown as OrderBuilderItemFormData)}
                    register={register}
                    language={language}
                    onRemove={() => removeItem(index)}
                  />
                ))}
              </div>
            )}

            {itemFields.length > 0 && (
              <div className="border-border flex items-center justify-between border-t pt-4">
                <span className="text-foreground text-sm font-semibold">
                  {t.builder.itemsSubtotal}
                </span>
                <span className="text-foreground text-lg font-semibold">
                  {formatCurrency(estimatedSubtotal, currency, language)}
                </span>
              </div>
            )}
          </div>

          {/* Step 3 — Shipping, billing, coupon */}
          <div hidden={activeStep !== 'shipping'} className="animate-tab-fade flex flex-col gap-6">
            <SectionLabel>{t.builder.shippingAddressTitle}</SectionLabel>
            <OrderAddressFields
              control={control}
              register={register}
              prefix="shippingAddress"
              language={language}
            />

            <SectionDivider />

            <Switch
              label={t.builder.sameBillingAddress}
              checked={sameBillingValue}
              onChange={(e) =>
                setValue('sameBillingAddress', e.target.checked, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
            {!sameBillingValue && (
              <>
                <SectionLabel>{t.builder.billingAddressTitle}</SectionLabel>
                <OrderAddressFields
                  control={control}
                  register={register}
                  prefix="billingAddress"
                  language={language}
                />
              </>
            )}

            <SectionDivider />

            <InputField
              label={t.builder.couponCode}
              helperText={t.builder.couponCodeHint}
              {...register('couponCode')}
            />
            <InputField label={`${t.builder.notes} ${t.builder.optional}`} {...register('notes')} />
          </div>

          {/* Step 4 — Review */}
          <div hidden={activeStep !== 'review'} className="animate-tab-fade flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-muted text-xs">{t.builder.reviewCustomer}</span>
              <span className="text-foreground text-sm font-medium">
                {selectedCustomer
                  ? `${selectedCustomer.firstName} ${selectedCustomer.lastName} (${selectedCustomer.email})`
                  : '—'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted text-xs">{t.builder.reviewLocation}</span>
              <span className="text-foreground text-sm font-medium">
                {selectedLocation?.name ?? '—'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-muted text-xs">{t.builder.reviewItems}</span>
              <div className="border-border divide-border-control divide-y rounded-lg border">
                {(itemsValue ?? []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="text-foreground">
                      {item.nameSnapshot} × {item.quantity}
                    </span>
                    <span className="text-secondary">
                      {formatCurrency(
                        item.unitPriceAmount * (Number.parseInt(item.quantity, 10) || 0),
                        item.currency,
                        language
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {couponCodeValue && (
              <div className="flex flex-col gap-1">
                <span className="text-muted text-xs">{t.builder.couponCode}</span>
                <span className="text-foreground font-mono text-sm">{couponCodeValue.toUpperCase()}</span>
              </div>
            )}

            <div className="border-border flex items-center justify-between border-t pt-4">
              <span className="text-foreground text-sm font-semibold">
                {t.builder.reviewEstimatedSubtotal}
              </span>
              <span className="text-foreground text-lg font-semibold">
                {formatCurrency(estimatedSubtotal, currency, language)}
              </span>
            </div>
            <p className="text-muted text-xs">{t.builder.reviewEstimatedNote}</p>
          </div>
        </Wizard>
      </div>
    </form>
  )
}
