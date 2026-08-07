import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useForm,
  useFieldArray,
  useWatch,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  PriceInput,
  RichTextArea,
  Select,
  Switch,
  Button,
  GalleryPicker,
  Wizard,
  SectionLabel,
  SectionDivider,
  LangSidebar,
  LangTabs,
  LangBadge,
  type WizardStep,
  type GalleryItem,
} from '@/shared/ui'
import { requiredLabel, useScopedEditingLanguage } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { currencySymbol } from '@/shared/lib/formatCurrency'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useContentLanguages } from '@/domains/site-config'
import { useProductTranslation } from '../../i18n'
import {
  useProductCategoriesForPicker,
  useTagsForProductPicker,
} from '../../api/products.queries'
import {
  createProductSchema,
  parseValuesText,
  PRODUCT_STATUS_VALUES,
} from '../../model/product.schema'
import type {
  ProductFormData,
  ProductVariantFormData,
  GalleryOrderToken,
} from '../../model/product.schema'
import { ProductVariantOptionRow } from './ProductVariantOptionRow'
import { ProductVariantRow } from './ProductVariantRow'
import { ProductInventoryPanel } from './ProductInventoryPanel'

function toGalleryItems(urls: string[] | undefined): GalleryItem[] {
  return (urls ?? []).map((url) => ({
    key: url,
    kind: 'existing' as const,
    url,
  }))
}

function deriveGalleryPayload(items: GalleryItem[]): {
  galleryFiles: File[]
  galleryOrder: GalleryOrderToken[]
  existingGalleryUrls: string[]
} {
  const galleryFiles: File[] = []
  const existingGalleryUrls: string[] = []
  const galleryOrder: GalleryOrderToken[] = items.map((item) => {
    if (item.kind === 'existing') {
      existingGalleryUrls.push(item.url)
      return { type: 'existing', url: item.url }
    }
    galleryFiles.push(item.file as File)
    return { type: 'new', index: galleryFiles.length - 1 }
  })
  return { galleryFiles, galleryOrder, existingGalleryUrls }
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function cartesianProduct(valueLists: string[][]): string[][] {
  return valueLists.reduce<string[][]>(
    (acc, values) => acc.flatMap((combo) => values.map((v) => [...combo, v])),
    [[]]
  )
}

function sameOptionValues(
  a: Record<string, string>,
  b: Record<string, string>
): boolean {
  return Object.entries(a).every(([k, val]) => b[k] === val)
}

function buildVariantsFromCombos(
  combos: string[][],
  existing: ProductVariantFormData[],
  basePrice: string
): ProductVariantFormData[] {
  return combos.map((combo) => {
    const optionValues = Object.fromEntries(
      combo.map((value, i) => [`option-${i}`, value])
    )
    const match = existing.find((v) => sameOptionValues(optionValues, v.optionValues))
    return (
      match ?? {
        optionValues,
        sku: '',
        price: basePrice || '0',
        compareAtPrice: '',
        imageUrl: '',
      }
    )
  })
}

export interface ProductFormProps {
  mode: 'create' | 'edit'
  productId?: string
  currency: string
  initialValues?: Partial<ProductFormData>
  initialGalleryUrls?: string[]
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (
    data: ProductFormData,
    galleryFiles: File[],
    galleryOrder: GalleryOrderToken[],
    existingGalleryUrls: string[]
  ) => void
}

type StepId =
  | 'general'
  | 'content'
  | 'pricing'
  | 'organization'
  | 'seo'
  | 'images'
  | 'inventory'

const STEP_FIELDS: Record<StepId, (keyof ProductFormData)[]> = {
  general: ['name', 'slug', 'sku'],
  content: ['shortDescription', 'description'],
  pricing: ['price', 'compareAtPrice', 'hasVariants', 'variantOptions', 'variants'],
  organization: ['categoryIds', 'tagIds', 'status'],
  seo: ['seoMetaTitle', 'seoMetaDescription', 'seoKeywords', 'seoOgImage'],
  images: [],
  inventory: [],
}

export const ProductForm = ({
  mode,
  productId,
  currency,
  initialValues,
  initialGalleryUrls,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: ProductFormProps) => {
  const { t, language } = useProductTranslation()
  const { languages } = useContentLanguages()
  const { editingLanguage, setEditingLanguage, defaultLanguage } =
    useScopedEditingLanguage(languages, language)
  const schema = useMemo(
    () => createProductSchema(t.validation, defaultLanguage),
    [t.validation, defaultLanguage]
  )

  const { data: categoriesData } = useProductCategoriesForPicker()
  const { data: tagsData } = useTagsForProductPicker()

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
    toGalleryItems(initialGalleryUrls)
  )
  const [activeStep, setActiveStep] = useState<StepId>('general')
  const [maxStep, setMaxStep] = useState(0)

  const emptyLocalized = useMemo(
    () =>
      Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as Record<
        Language,
        string
      >,
    []
  )

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    trigger,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema) as Resolver<ProductFormData>,
    mode: 'onTouched',
    defaultValues: {
      slug: { ...emptyLocalized },
      name: { ...emptyLocalized },
      shortDescription: { ...emptyLocalized },
      description: { ...emptyLocalized },
      sku: '',
      price: '',
      compareAtPrice: '',
      categoryIds: [],
      tagIds: [],
      status: 'draft',
      seoMetaTitle: { ...emptyLocalized },
      seoMetaDescription: { ...emptyLocalized },
      seoKeywords: { ...emptyLocalized },
      seoOgImage: '',
      hasVariants: false,
      variantOptions: [],
      variants: [],
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: 'variantOptions' })

  const {
    fields: variantFields,
    remove: removeVariant,
    replace: replaceVariants,
  } = useFieldArray({ control, name: 'variants' })

  const nameValues = useWatch({ control, name: 'name' })
  const sdValues = useWatch({ control, name: 'shortDescription' })
  const descValues = useWatch({ control, name: 'description' })
  const slugValues = useWatch({ control, name: 'slug' })
  const priceValue = useWatch({ control, name: 'price' })
  const categoryIdsValue = useWatch({ control, name: 'categoryIds' })
  const tagIdsValue = useWatch({ control, name: 'tagIds' })
  const statusValue = useWatch({ control, name: 'status' })
  const hasVariantsValue = useWatch({ control, name: 'hasVariants' })
  const variantOptionsValue = useWatch({ control, name: 'variantOptions' })
  const variantsValue = useWatch({ control, name: 'variants' })

  // Per-language slug detach — mirrors portfolio: the effect keeps the slug
  // synced to the name until the user types into the slug field themselves
  // (or the initial data already carried a real slug for that language).
  const detachedRef = useRef<Set<Language>>(
    new Set(
      SUPPORTED_LANGUAGES.filter((l) => !!initialValues?.slug?.[l]?.trim())
    )
  )

  const currentNameValue = nameValues?.[editingLanguage] ?? ''

  useEffect(() => {
    if (detachedRef.current.has(editingLanguage)) return
    setValue(`slug.${editingLanguage}`, slugify(currentNameValue), {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    })
  }, [currentNameValue, editingLanguage, setValue])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
    setValue(`slug.${editingLanguage}`, cleaned, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    if (cleaned) {
      detachedRef.current.add(editingLanguage)
    } else {
      detachedRef.current.delete(editingLanguage)
    }
  }

  const categoryOptions = useMemo(
    () =>
      (categoriesData ?? []).map((c) => ({
        value: c.id,
        label: c.name[language] || c.name.en,
      })),
    [categoriesData, language]
  )

  const tagOptions = useMemo(
    () =>
      (tagsData ?? []).map((tag) => ({
        value: tag.id,
        label: tag.name[language] || tag.name.en,
      })),
    [tagsData, language]
  )

  const statusOptions = PRODUCT_STATUS_VALUES.map((s) => ({
    value: s,
    label: t.status[s],
  }))

  type LangErrors = Record<Language, { message?: string } | undefined>

  const hasContent = (lang: Language): boolean =>
    !!(nameValues?.[lang]?.trim() || sdValues?.[lang]?.trim())

  const hasError = (lang: Language): boolean => {
    const ne = (errors.name as LangErrors)?.[lang]
    const sde = (errors.shortDescription as LangErrors)?.[lang]
    const de = (errors.description as LangErrors)?.[lang]
    return !!(ne ?? sde ?? de)
  }

  const nameError = (errors.name as LangErrors)?.[editingLanguage]?.message
  const sdError = (errors.shortDescription as LangErrors)?.[editingLanguage]
    ?.message
  const descError = (errors.description as LangErrors)?.[editingLanguage]
    ?.message

  const handleAddOption = () =>
    appendOption({ name: { ...emptyLocalized }, valuesText: '' })

  const handleGenerateVariants = () => {
    const valueLists = (variantOptionsValue ?? []).map((o) =>
      parseValuesText(o.valuesText)
    )
    if (valueLists.length === 0 || valueLists.some((v) => v.length === 0))
      return
    const combos = cartesianProduct(valueLists)
    const next = buildVariantsFromCombos(
      combos,
      getValues('variants'),
      priceValue
    )
    replaceVariants(next)
  }

  const stepHasError = (step: StepId) =>
    STEP_FIELDS[step].some((f) => f in errors)

  const steps: WizardStep[] = [
    { id: 'general', label: t.form.sectionGeneral, error: stepHasError('general') },
    {
      id: 'content',
      label: t.form.sectionContent,
      optional: true,
      error: stepHasError('content'),
    },
    { id: 'pricing', label: t.form.sectionPricing, error: stepHasError('pricing') },
    {
      id: 'organization',
      label: t.form.sectionOrganization,
      optional: true,
      error: stepHasError('organization'),
    },
    {
      id: 'seo',
      label: t.form.sectionSeo,
      optional: true,
      error: stepHasError('seo'),
    },
    { id: 'images', label: t.form.sectionImages, optional: true },
    { id: 'inventory', label: t.form.sectionInventory, optional: true },
  ]

  const reachedIndex = mode === 'edit' ? steps.length - 1 : maxStep

  const handleNext = async () => {
    const ok = await trigger(STEP_FIELDS[activeStep] as (keyof ProductFormData)[])
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
    (data) => {
      const { galleryFiles, galleryOrder, existingGalleryUrls } =
        deriveGalleryPayload(galleryItems)
      onSubmit(data, galleryFiles, galleryOrder, existingGalleryUrls)
    },
    (formErrors) => {
      for (const step of [
        'general',
        'content',
        'pricing',
        'organization',
        'seo',
      ] as StepId[]) {
        if (STEP_FIELDS[step].some((f) => f in formErrors)) {
          setActiveStep(step)
          break
        }
      }
      const nameErrs = formErrors.name as LangErrors | undefined
      if (nameErrs) {
        const errLang = languages.find((l) => nameErrs[l])
        if (errLang) setEditingLanguage(errLang)
      }
    }
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {languages.length > 1 && (
        <div className="mb-4 lg:hidden">
          <LangTabs
            languages={languages}
            editingLanguage={editingLanguage}
            userLanguage={language}
            hasContent={hasContent}
            hasError={hasError}
            onChange={setEditingLanguage}
          />
        </div>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="border-border bg-surface min-w-0 flex-1 rounded-xl border p-8">
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
            backLabel={t.form.back}
            nextLabel={t.form.next}
            submitLabel={mode === 'create' ? t.form.create : t.form.save}
            cancelLabel={t.form.cancel}
            optionalLabel={t.form.optional}
          >
            {/* Step 1 — General */}
            <div
              hidden={activeStep !== 'general'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{requiredLabel(t.form.name)}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                  <span className="text-muted text-xs">
                    {NATIVE_LANGUAGE_NAMES[editingLanguage]}
                  </span>
                </div>
                <InputField
                  variant={nameError ? 'error' : undefined}
                  errorMessage={nameError}
                  {...register(`name.${editingLanguage}`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.slug}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField
                  helperText={t.form.slugHint}
                  variant={
                    (errors.slug as LangErrors)?.[editingLanguage]
                      ? 'error'
                      : undefined
                  }
                  errorMessage={
                    (errors.slug as LangErrors)?.[editingLanguage]?.message
                  }
                  value={slugValues?.[editingLanguage] ?? ''}
                  onChange={handleSlugChange}
                />
              </div>
              <InputField
                label={t.form.sku}
                variant={errors.sku ? 'error' : undefined}
                errorMessage={errors.sku?.message}
                {...register('sku')}
              />
            </div>

            {/* Step 2 — Content */}
            <div
              hidden={activeStep !== 'content'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.shortDescription}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField
                  variant={sdError ? 'error' : undefined}
                  errorMessage={sdError}
                  {...register(`shortDescription.${editingLanguage}`)}
                />
              </div>
              <RichTextArea
                label={
                  <span className="flex items-center gap-2">
                    {t.form.description}
                    <LangBadge lang={editingLanguage} />
                  </span>
                }
                variant={descError ? 'error' : 'default'}
                errorMessage={descError}
                value={descValues?.[editingLanguage] ?? ''}
                onChange={(html) =>
                  setValue(`description.${editingLanguage}`, html, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                disabled={isSubmitting}
                minRows={8}
              />
            </div>

            {/* Step 3 — Pricing & variants */}
            <div
              hidden={activeStep !== 'pricing'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <PriceInput
                  label={requiredLabel(t.form.price)}
                  prefix={currencySymbol(currency, language)}
                  variant={errors.price ? 'error' : undefined}
                  errorMessage={errors.price?.message}
                  {...register('price')}
                />
                <PriceInput
                  label={t.form.compareAtPrice}
                  prefix={currencySymbol(currency, language)}
                  variant={errors.compareAtPrice ? 'error' : undefined}
                  errorMessage={errors.compareAtPrice?.message}
                  {...register('compareAtPrice')}
                />
              </div>

              <SectionDivider label={t.form.variants} />

              <Switch
                label={t.form.hasVariants}
                checked={hasVariantsValue}
                onChange={(e) =>
                  setValue('hasVariants', e.target.checked, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                disabled={isSubmitting}
              />

              {hasVariantsValue && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <SectionLabel>{t.form.variantOptions}</SectionLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={handleAddOption}
                    >
                      {t.form.addVariantOption}
                    </Button>
                  </div>

                  {optionFields.map((field, index) => (
                    <ProductVariantOptionRow
                      key={field.id}
                      index={index}
                      register={register}
                      editingLanguage={editingLanguage}
                      onRemove={() => removeOption(index)}
                    />
                  ))}

                  <div className="flex items-center justify-between gap-3">
                    <SectionLabel>{t.form.variants}</SectionLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      disabled={!optionFields.length}
                      onClick={handleGenerateVariants}
                    >
                      {t.form.generateVariants}
                    </Button>
                  </div>

                  {errors.variants && !Array.isArray(errors.variants) && (
                    <p className="text-danger-600 text-sm">
                      {
                        (errors.variants as unknown as { message?: string })
                          .message
                      }
                    </p>
                  )}

                  {variantFields.length === 0 ? (
                    <p className="text-secondary text-sm">
                      {t.form.noVariantsYet}
                    </p>
                  ) : (
                    variantFields.map((field, index) => (
                      <ProductVariantRow
                        key={field.id}
                        index={index}
                        register={register}
                        language={editingLanguage}
                        currency={currency}
                        optionValues={variantsValue?.[index]?.optionValues ?? {}}
                        variantOptions={variantOptionsValue ?? []}
                        onRemove={() => removeVariant(index)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Step 4 — Organization */}
            <div
              hidden={activeStep !== 'organization'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <Select
                label={t.form.categoryIds}
                multiple
                options={categoryOptions}
                value={categoryIdsValue ?? []}
                lang={language}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (o) => o.value
                  )
                  setValue('categoryIds', selected, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }}
              />
              <Select
                label={t.form.tagIds}
                multiple
                options={tagOptions}
                value={tagIdsValue ?? []}
                lang={language}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (o) => o.value
                  )
                  setValue('tagIds', selected, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }}
              />
              <Select
                label={t.form.status}
                options={statusOptions}
                value={statusValue}
                lang={language}
                onChange={(e) =>
                  setValue('status', e.target.value as typeof statusValue, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
            </div>

            {/* Step 5 — SEO */}
            <div
              hidden={activeStep !== 'seo'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.metaTitle}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField
                  {...register(`seoMetaTitle.${editingLanguage}`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.metaDescription}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField
                  {...register(`seoMetaDescription.${editingLanguage}`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.keywords}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField {...register(`seoKeywords.${editingLanguage}`)} />
              </div>
              <InputField
                label={t.form.ogImage}
                variant={errors.seoOgImage ? 'error' : undefined}
                errorMessage={errors.seoOgImage?.message}
                {...register('seoOgImage')}
              />
            </div>

            {/* Step 6 — Images */}
            <div hidden={activeStep !== 'images'} className="animate-tab-fade">
              <div className="flex flex-col gap-3">
                <SectionLabel>{t.form.gallery}</SectionLabel>
                <GalleryPicker
                  items={galleryItems}
                  onItemsChange={setGalleryItems}
                  uploadLabel={t.form.galleryUploadLabel}
                  dragLabel={t.form.galleryDragLabel}
                  removeLabel={t.form.galleryRemoveLabel}
                  formatsHint={t.form.galleryFormatsHint}
                  maxItemsHint={t.form.galleryMaxHint}
                  disabled={isSubmitting}
                  onSelectLibrary={() => {}}
                  libraryTexts={t.mediaLibrary}
                />
              </div>
            </div>

            {/* Step 7 — Inventory (edit-mode only) */}
            <div hidden={activeStep !== 'inventory'} className="animate-tab-fade">
              {mode === 'create' || !productId ? (
                <p className="text-secondary text-sm">
                  {t.form.inventoryCreateFirst}
                </p>
              ) : (
                <ProductInventoryPanel
                  productId={productId}
                  hasVariants={hasVariantsValue}
                  variants={variantsValue ?? []}
                  variantOptions={variantOptionsValue ?? []}
                  language={editingLanguage}
                />
              )}
            </div>
          </Wizard>
        </div>

        {languages.length > 1 && (
          <div className="border-border bg-surface hidden rounded-xl border p-4 lg:sticky lg:top-4 lg:block lg:w-52 lg:shrink-0">
            <LangSidebar
              languages={languages}
              editingLanguage={editingLanguage}
              userLanguage={language}
              hasContent={hasContent}
              hasError={hasError}
              label={t.form.tabTranslations}
              onChange={setEditingLanguage}
            />
          </div>
        )}
      </div>
    </form>
  )
}
