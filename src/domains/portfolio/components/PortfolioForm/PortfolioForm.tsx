import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputNumber,
  InputDate,
  Select,
  Switch,
  RichTextArea,
  CoverPicker,
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
import { uploadEditorImage, resolveRichTextImages } from '@/shared/api/storage'
import type { StorageFile } from '@/shared/api/storage'
import { useConfigData } from '@/shared/api/config'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePortfolioTranslation } from '../../i18n'
import {
  useServicesForPortfolioPicker,
  useClientsForPortfolioPicker,
} from '../../api/portfolio.queries'
import {
  createPortfolioSchema,
  PORTFOLIO_STATUS_VALUES,
} from '../../model/portfolio.schema'
import type {
  PortfolioFormData,
  GalleryOrderToken,
} from '../../model/portfolio.schema'

function stepHasMediaError(step: StepId, coverMissing: boolean): boolean {
  return step === 'media' && coverMissing
}

function coverPickerMessages(
  coverMissing: boolean,
  formatsHint: string,
  requiredMessage: string
): { formatsHint?: string; errorMessage?: string } {
  return coverMissing ? { errorMessage: requiredMessage } : { formatsHint }
}

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
} {
  const galleryFiles: File[] = []
  const galleryOrder: GalleryOrderToken[] = items.map((item) => {
    if (item.kind === 'existing') return { type: 'existing', url: item.url }
    galleryFiles.push(item.file as File)
    return { type: 'new', index: galleryFiles.length - 1 }
  })
  return { galleryFiles, galleryOrder }
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

export interface PortfolioFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<PortfolioFormData>
  initialCoverUrl?: string
  initialGalleryUrls?: string[]
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (
    data: PortfolioFormData,
    cover?: File | null,
    removeCover?: boolean,
    galleryFiles?: File[],
    galleryOrder?: GalleryOrderToken[],
    coverLibraryUrl?: string
  ) => void
}

type StepId = 'general' | 'content' | 'relations' | 'media'

const STEP_FIELDS: Record<StepId, (keyof PortfolioFormData)[]> = {
  general: ['name', 'shortDescription', 'slug'],
  content: ['description'],
  relations: [
    'serviceIds',
    'clientId',
    'technologies',
    'projectUrl',
    'startDate',
    'endDate',
    'featured',
  ],
  media: ['status', 'order'],
}

// ─── Main form ────────────────────────────────────────────────────────────────

export const PortfolioForm = ({
  mode,
  initialValues,
  initialCoverUrl,
  initialGalleryUrls,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: PortfolioFormProps) => {
  const { t, language } = usePortfolioTranslation()
  const schema = useMemo(
    () => createPortfolioSchema(t.validation, language),
    [t.validation, language]
  )

  const { data: servicesData } = useServicesForPortfolioPicker()
  const { data: clientsData } = useClientsForPortfolioPicker()
  const { data: configData } = useConfigData(['technologies'], language)

  const [editingLanguage, setEditingLanguage] = useState<Language>(language)
  const [pendingCover, setPendingCover] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [coverLibraryUrl, setCoverLibraryUrl] = useState<string | null>(null)
  const [coverTouched, setCoverTouched] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
    toGalleryItems(initialGalleryUrls)
  )
  const [activeStep, setActiveStep] = useState<StepId>('general')
  const [maxStep, setMaxStep] = useState(0)

  // Whether a cover will actually be persisted after this submit — accounts
  // for a newly picked file, a library pick, the existing one, and an
  // explicit removal.
  const willHaveCover =
    !!pendingCover || !!coverLibraryUrl || (!!initialCoverUrl && !removeCover)
  const coverMissing = coverTouched && !willHaveCover

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
    setError,
    trigger,
    control,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(schema) as Resolver<PortfolioFormData>,
    mode: 'onTouched',
    defaultValues: {
      slug: { ...emptyLocalized },
      name: { ...emptyLocalized },
      shortDescription: { ...emptyLocalized },
      description: { ...emptyLocalized },
      serviceIds: [],
      clientId: '',
      technologies: [],
      projectUrl: '',
      startDate: '',
      endDate: '',
      featured: false,
      order: 0,
      status: 'draft',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const nameValues = useWatch({ control, name: 'name' })
  const sdValues = useWatch({ control, name: 'shortDescription' })
  const descValues = useWatch({ control, name: 'description' })
  const slugValues = useWatch({ control, name: 'slug' })
  const serviceIdsValue = useWatch({ control, name: 'serviceIds' })
  const clientIdValue = useWatch({ control, name: 'clientId' })
  const technologiesValue = useWatch({ control, name: 'technologies' })
  const featuredValue = useWatch({ control, name: 'featured' })
  const statusValue = useWatch({ control, name: 'status' })

  // Per-language slug detach — mirrors services behavior
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

  // Service options — show warning chip/option when no translation in current language
  const serviceOptions = useMemo(
    () =>
      (servicesData ?? []).map((svc) => {
        const translated = (svc.name as Record<string, string>)[language]
        const hasTranslation = !!translated?.trim()
        const label = hasTranslation ? translated : t.form.serviceNoTranslation
        return {
          value: svc.id,
          label,
          icon: hasTranslation ? undefined : ('RiAlertLine' as const),
        }
      }),
    [servicesData, language, t.form.serviceNoTranslation]
  )

  // Client options
  const clientOptions = useMemo(
    () =>
      (clientsData ?? []).map((c) => ({
        value: c.id,
        label: c.businessName,
      })),
    [clientsData]
  )

  // Technologies options from config API
  const techOptions = useMemo(
    () =>
      (configData?.technologies ?? []).map((o) => ({
        value: o.value,
        label: o.label,
      })),
    [configData]
  )

  const statusOptions = PORTFOLIO_STATUS_VALUES.map((s) => ({
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

  const stepHasError = (step: StepId) =>
    STEP_FIELDS[step].some((f) => f in errors) ||
    stepHasMediaError(step, coverMissing)

  const steps: WizardStep[] = [
    {
      id: 'general',
      label: t.form.sectionGeneral,
      error: stepHasError('general'),
    },
    {
      id: 'content',
      label: t.form.sectionContent,
      optional: true,
      error: stepHasError('content'),
    },
    {
      id: 'relations',
      label: t.form.sectionRelations,
      error: stepHasError('relations'),
    },
    {
      id: 'media',
      label: t.form.sectionMedia,
      optional: true,
      error: stepHasError('media'),
    },
  ]

  const reachedIndex = mode === 'edit' ? steps.length - 1 : maxStep

  const handleNext = async () => {
    const ok = await trigger(
      STEP_FIELDS[activeStep] as (keyof PortfolioFormData)[]
    )
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
    async (data) => {
      if (!willHaveCover) {
        setCoverTouched(true)
        setActiveStep('media')
        return
      }
      const resolvedDesc = { ...data.description }
      await Promise.all(
        SUPPORTED_LANGUAGES.map(async (lang) => {
          if (resolvedDesc[lang]) {
            resolvedDesc[lang] = await resolveRichTextImages(
              resolvedDesc[lang],
              uploadEditorImage
            )
          }
        })
      )
      const { galleryFiles, galleryOrder } = deriveGalleryPayload(galleryItems)
      onSubmit(
        { ...data, description: resolvedDesc },
        pendingCover,
        removeCover,
        galleryFiles,
        galleryOrder,
        coverLibraryUrl ?? undefined
      )
    },
    (formErrors) => {
      setCoverTouched(true)
      for (const step of [
        'general',
        'content',
        'relations',
        'media',
      ] as StepId[]) {
        if (STEP_FIELDS[step].some((f) => f in formErrors)) {
          setActiveStep(step)
          break
        }
      }
      const nameErrs = formErrors.name as LangErrors | undefined
      if (nameErrs) {
        const errLang = SUPPORTED_LANGUAGES.find((l) => nameErrs[l])
        if (errLang) setEditingLanguage(errLang)
      }
    }
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mb-4 lg:hidden">
        <LangTabs
          editingLanguage={editingLanguage}
          userLanguage={language}
          hasContent={hasContent}
          hasError={hasError}
          onChange={setEditingLanguage}
        />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* ── Main form ──────────────────────────────────── */}
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
            {/* Step 1 — General (translated fields + per-lang slug) */}
            <div
              hidden={activeStep !== 'general'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>
                    {t.form.name} <span className="text-red-500">*</span>
                  </SectionLabel>
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
                  <SectionLabel>
                    {t.form.shortDescription}{' '}
                    <span className="text-red-500">*</span>
                  </SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField
                  variant={sdError ? 'error' : undefined}
                  errorMessage={sdError}
                  {...register(`shortDescription.${editingLanguage}`)}
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
            </div>

            {/* Step 2 — Content (description, translated) */}
            <div
              hidden={activeStep !== 'content'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <RichTextArea
                label={
                  <span className="flex items-center gap-2">
                    {t.form.description}
                    <LangBadge lang={editingLanguage} />
                    <span className="text-muted text-xs font-normal tracking-normal normal-case">
                      {NATIVE_LANGUAGE_NAMES[editingLanguage]}
                    </span>
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

            {/* Step 3 — Relations (cross-language: services, client, technologies, url, dates) */}
            <div
              hidden={activeStep !== 'relations'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <Select
                label={
                  <>
                    {t.form.serviceIds} <span className="text-red-500">*</span>
                  </>
                }
                multiple
                options={serviceOptions}
                value={serviceIdsValue ?? []}
                lang={language}
                helperText={t.form.serviceIdsHint}
                variant={errors.serviceIds ? 'error' : undefined}
                errorMessage={errors.serviceIds?.message}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (o) => o.value
                  )
                  setValue('serviceIds', selected, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }}
              />
              <Select
                label={`${t.form.clientId} ${t.form.optional}`}
                options={[
                  { value: '', label: t.form.select },
                  ...clientOptions,
                ]}
                value={clientIdValue ?? ''}
                lang={language}
                texts={{ noOptionsFound: t.form.clientNoOptions }}
                variant={errors.clientId ? 'error' : undefined}
                errorMessage={errors.clientId?.message}
                onChange={(e) =>
                  setValue('clientId', e.target.value || '', {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              <SectionDivider label={t.form.sectionGlobal} />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Select
                  label={`${t.form.technologies} ${t.form.optional}`}
                  multiple
                  options={techOptions}
                  value={technologiesValue ?? []}
                  lang={language}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (o) => o.value
                    )
                    setValue('technologies', selected, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }}
                />
                <InputField
                  label={`${t.form.projectUrl} ${t.form.optional}`}
                  variant={errors.projectUrl ? 'error' : undefined}
                  errorMessage={errors.projectUrl?.message}
                  {...register('projectUrl')}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputDate
                  label={
                    <>
                      {t.form.startDate} <span className="text-red-500">*</span>
                    </>
                  }
                  lang={language}
                  variant={errors.startDate ? 'error' : 'default'}
                  errorMessage={errors.startDate?.message}
                  {...register('startDate')}
                />
                <InputDate
                  label={`${t.form.endDate} ${t.form.optional}`}
                  lang={language}
                  variant={errors.endDate ? 'error' : 'default'}
                  errorMessage={errors.endDate?.message}
                  {...register('endDate')}
                />
              </div>
              <Switch
                label={t.form.featured}
                checked={featuredValue}
                onChange={(e) =>
                  setValue('featured', e.target.checked, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                disabled={isSubmitting}
              />
            </div>

            {/* Step 4 — Media */}
            <div hidden={activeStep !== 'media'} className="animate-tab-fade">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-3 lg:col-span-2">
                  <SectionLabel>
                    {t.form.cover} <span className="text-red-500">*</span>
                  </SectionLabel>
                  <CoverPicker
                    currentUrl={coverLibraryUrl ?? initialCoverUrl}
                    uploadLabel={t.form.coverUploadLabel}
                    dragLabel={t.form.coverDragLabel}
                    dragOrLabel={t.form.coverDragOrLabel}
                    browseLabel={t.form.coverBrowseLabel}
                    {...coverPickerMessages(
                      coverMissing,
                      t.form.coverFormatsHint,
                      t.form.coverRequired
                    )}
                    removeLabel={t.form.coverRemoveLabel}
                    disabled={isSubmitting}
                    onChange={(file) => {
                      setPendingCover(file)
                      if (file) {
                        setRemoveCover(false)
                        setCoverLibraryUrl(null)
                      }
                    }}
                    onRemove={() => {
                      setPendingCover(null)
                      setRemoveCover(true)
                      setCoverLibraryUrl(null)
                    }}
                    onSelectLibrary={(file: StorageFile) => {
                      setCoverLibraryUrl(file.original.url)
                      setPendingCover(null)
                      setRemoveCover(false)
                    }}
                    libraryTexts={t.mediaLibrary}
                  />
                </div>
                <div className="flex flex-col gap-6">
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
                  <InputNumber
                    label={t.form.order}
                    min={0}
                    {...register('order')}
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <SectionLabel>
                  {t.form.gallery}{' '}
                  <span className="text-muted text-xs font-normal tracking-normal normal-case">
                    {t.form.optional}
                  </span>
                </SectionLabel>
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
          </Wizard>
        </div>

        {/* ── Language sidebar ──────────────────────────────────── */}
        <div className="border-border bg-surface hidden rounded-xl border p-4 lg:sticky lg:top-4 lg:block lg:w-52 lg:shrink-0">
          <LangSidebar
            editingLanguage={editingLanguage}
            userLanguage={language}
            hasContent={hasContent}
            hasError={hasError}
            label={t.form.tabTranslations}
            onChange={setEditingLanguage}
          />
        </div>
      </div>
    </form>
  )
}
