import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import {
  InputField,
  InputNumber,
  Select,
  Switch,
  RichTextArea,
  CoverPicker,
  Wizard,
  SectionLabel,
  type WizardStep,
} from '@/shared/ui'
import { uploadEditorImage, resolveRichTextImages } from '@/shared/api/storage'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePortfolioTranslation } from '../../i18n'
import { useServicesForPortfolioPicker } from '../../api/portfolio.queries'
import { createPortfolioSchema, PORTFOLIO_STATUS_VALUES } from '../../model/portfolio.schema'
import type { PortfolioFormData } from '../../model/portfolio.schema'

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
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: PortfolioFormData, cover?: File | null, removeCover?: boolean) => void
}

type StepId = 'general' | 'content' | 'relations' | 'media'

const STEP_FIELDS: Record<StepId, (keyof PortfolioFormData)[]> = {
  general: ['name', 'shortDescription', 'slug'],
  content: ['description', 'technologies', 'projectUrl'],
  relations: ['serviceIds', 'clientId', 'startDate', 'endDate', 'featured'],
  media: ['status', 'order'],
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const langDotClass = (error: boolean, filled: boolean): string => {
  if (error) return 'bg-red-500'
  if (filled) return 'bg-emerald-500'
  return 'bg-border'
}

const LangBadge = ({ lang }: { lang: Language }) => (
  <span className="inline-flex h-5 items-center rounded bg-primary-700/10 px-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary-600">
    {lang}
  </span>
)

interface LangSidebarProps {
  editingLanguage: Language
  userLanguage: Language
  hasContent: (lang: Language) => boolean
  hasError: (lang: Language) => boolean
  label: string
  onChange: (lang: Language) => void
}

const LangSidebar = ({
  editingLanguage,
  userLanguage,
  hasContent,
  hasError,
  label,
  onChange,
}: LangSidebarProps) => (
  <div className="flex flex-col gap-1">
    <span className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
    {SUPPORTED_LANGUAGES.map((lang) => {
      const isActive = lang === editingLanguage
      const filled = hasContent(lang)
      const error = hasError(lang)
      return (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={clsx(
            'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors',
            isActive ? 'bg-primary-700/10 ring-1 ring-primary-700/20' : 'hover:bg-surface-subtle',
          )}
        >
          <LangBadge lang={lang} />
          <span
            className={clsx(
              'flex-1 truncate text-sm',
              isActive ? 'font-medium text-primary-600' : 'text-foreground',
            )}
          >
            {NATIVE_LANGUAGE_NAMES[lang]}
          </span>
          {lang === userLanguage && <span className="text-[10px] text-primary-600">★</span>}
          <span className={clsx('h-2 w-2 shrink-0 rounded-full', langDotClass(error, filled))} />
        </button>
      )
    })}
  </div>
)

// ─── Main form ────────────────────────────────────────────────────────────────

export const PortfolioForm = ({
  mode,
  initialValues,
  initialCoverUrl,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: PortfolioFormProps) => {
  const { t, language } = usePortfolioTranslation()
  const schema = useMemo(() => createPortfolioSchema(t.validation, language), [t.validation, language])
  const { data: servicesData } = useServicesForPortfolioPicker()

  const [editingLanguage, setEditingLanguage] = useState<Language>(language)
  const [pendingCover, setPendingCover] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [activeStep, setActiveStep] = useState<StepId>('general')
  const [maxStep, setMaxStep] = useState(0)

  const emptyLocalized = useMemo(
    () => Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as Record<Language, string>,
    [],
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
      slug: '',
      name: { ...emptyLocalized },
      shortDescription: { ...emptyLocalized },
      description: { ...emptyLocalized },
      serviceIds: [],
      clientId: '',
      technologies: '',
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
  const slugValue = useWatch({ control, name: 'slug' })
  const serviceIdsValue = useWatch({ control, name: 'serviceIds' })
  const featuredValue = useWatch({ control, name: 'featured' })
  const statusValue = useWatch({ control, name: 'status' })

  // Auto-fill slug from English name when not in edit mode
  const slugDetached = useRef(!!initialValues?.slug?.trim())
  const currentEnName = nameValues?.en ?? ''

  useEffect(() => {
    if (mode === 'edit' || slugDetached.current) return
    setValue('slug', slugify(currentEnName), {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    })
  }, [currentEnName, mode, setValue])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
    setValue('slug', cleaned, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    slugDetached.current = !!cleaned
  }

  const serviceOptions = (servicesData ?? []).map((svc) => ({
    value: svc.id,
    label: (svc.name as Record<string, string>)[language] || (svc.name as Record<string, string>).en || svc.id,
  }))

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
  const sdError = (errors.shortDescription as LangErrors)?.[editingLanguage]?.message
  const descError = (errors.description as LangErrors)?.[editingLanguage]?.message

  const stepHasError = (step: StepId) => STEP_FIELDS[step].some((f) => f in errors)

  const steps: WizardStep[] = [
    { id: 'general', label: t.form.sectionGeneral, error: stepHasError('general') },
    { id: 'content', label: t.form.sectionContent, optional: true, error: stepHasError('content') },
    { id: 'relations', label: t.form.sectionRelations, error: stepHasError('relations') },
    { id: 'media', label: t.form.sectionMedia, optional: true, error: stepHasError('media') },
  ]

  const reachedIndex = mode === 'edit' ? steps.length - 1 : maxStep

  const handleNext = async () => {
    const ok = await trigger(STEP_FIELDS[activeStep] as (keyof PortfolioFormData)[])
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
      const resolvedDesc = { ...data.description }
      await Promise.all(
        SUPPORTED_LANGUAGES.map(async (lang) => {
          if (resolvedDesc[lang]) {
            resolvedDesc[lang] = await resolveRichTextImages(resolvedDesc[lang], uploadEditorImage)
          }
        }),
      )
      onSubmit({ ...data, description: resolvedDesc }, pendingCover, removeCover)
    },
    (formErrors) => {
      for (const step of ['general', 'content', 'relations', 'media'] as StepId[]) {
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
    },
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* ── Main form ──────────────────────────────────── */}
        <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface p-8">
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
            <div hidden={activeStep !== 'general'} className="animate-tab-fade flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>
                    {t.form.name} <span className="text-red-500">*</span>
                  </SectionLabel>
                  <LangBadge lang={editingLanguage} />
                  <span className="text-xs text-muted">{NATIVE_LANGUAGE_NAMES[editingLanguage]}</span>
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
                    {t.form.shortDescription} <span className="text-red-500">*</span>
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
                <SectionLabel>
                  {t.form.slug} <span className="text-red-500">*</span>
                </SectionLabel>
                <InputField
                  helperText={t.form.slugHint}
                  variant={errors.slug ? 'error' : undefined}
                  errorMessage={errors.slug?.message}
                  value={slugValue ?? ''}
                  onChange={handleSlugChange}
                />
              </div>
            </div>

            {/* Step 2 — Content */}
            <div hidden={activeStep !== 'content'} className="animate-tab-fade flex flex-col gap-6">
              <RichTextArea
                label={
                  <span className="flex items-center gap-2">
                    {t.form.description}
                    <LangBadge lang={editingLanguage} />
                    <span className="text-xs font-normal normal-case tracking-normal text-muted">
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
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <InputField
                  label={t.form.technologies}
                  helperText={t.form.technologiesHint}
                  {...register('technologies')}
                />
                <InputField
                  label={`${t.form.projectUrl} ${t.form.optional}`}
                  variant={errors.projectUrl ? 'error' : undefined}
                  errorMessage={errors.projectUrl?.message}
                  {...register('projectUrl')}
                />
              </div>
            </div>

            {/* Step 3 — Relations */}
            <div hidden={activeStep !== 'relations'} className="animate-tab-fade flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
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
                    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                    setValue('serviceIds', selected, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }}
                />
              </div>
              <InputField
                label={`${t.form.clientId} ${t.form.optional}`}
                helperText={t.form.clientIdHint}
                variant={errors.clientId ? 'error' : undefined}
                errorMessage={errors.clientId?.message}
                {...register('clientId')}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                  label={
                    <>
                      {t.form.startDate} <span className="text-red-500">*</span>
                    </>
                  }
                  type="date"
                  variant={errors.startDate ? 'error' : undefined}
                  errorMessage={errors.startDate?.message}
                  {...register('startDate')}
                />
                <InputField
                  label={`${t.form.endDate} ${t.form.optional}`}
                  type="date"
                  variant={errors.endDate ? 'error' : undefined}
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
                  {!pendingCover && !initialCoverUrl && (
                    <p className="text-xs text-red-500">{t.form.coverRequired}</p>
                  )}
                  <CoverPicker
                    currentUrl={initialCoverUrl}
                    uploadLabel={t.form.coverUploadLabel}
                    dragLabel={t.form.coverDragLabel}
                    browseLabel={t.form.coverBrowseLabel}
                    formatsHint={t.form.coverFormatsHint}
                    removeLabel={t.form.coverRemoveLabel}
                    disabled={isSubmitting}
                    onChange={(file) => {
                      setPendingCover(file)
                      if (file) setRemoveCover(false)
                    }}
                    onRemove={() => {
                      setPendingCover(null)
                      setRemoveCover(true)
                    }}
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
                  <InputNumber label={t.form.order} min={0} {...register('order')} />
                </div>
              </div>
            </div>
          </Wizard>
        </div>

        {/* ── Language sidebar ──────────────────────────────────── */}
        <div className="w-full rounded-xl border border-border bg-surface p-4 lg:sticky lg:top-4 lg:w-52 lg:shrink-0">
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
