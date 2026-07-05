import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import {
  InputField,
  InputNumber,
  Select,
  Switch,
  TextArea,
  CoverPicker,
  Wizard,
  SectionLabel,
  type WizardStep,
} from '@/shared/ui'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useServicesTranslation } from '../../i18n'
import { createServiceSchema, PILLAR_VALUES } from '../../model/service.schema'
import type { ServiceFormData } from '../../model/service.schema'

const ICON_ACCEPT = 'image/svg+xml,image/png,image/jpeg,image/webp'

export interface ServiceFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<ServiceFormData>
  initialCoverUrl?: string
  initialIconUrl?: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (
    data: ServiceFormData,
    cover?: File | null,
    iconFile?: File | null,
    removeCover?: boolean,
    removeIcon?: boolean
  ) => void
}

type StepId = 'general' | 'content' | 'media'

const STEP_FIELDS: Record<StepId, (keyof ServiceFormData)[]> = {
  general: ['name', 'shortDescription', 'slug'],
  content: ['description', 'pillars', 'tags'],
  media: ['order', 'isActive'],
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const langDotClass = (error: boolean, filled: boolean): string => {
  if (error) return 'bg-red-500'
  if (filled) return 'bg-emerald-500'
  return 'bg-border'
}

const LangBadge = ({ lang }: { lang: Language }) => (
  <span className="inline-flex h-5 items-center rounded bg-primary-700/10 px-1.5 text-[10px] font-semibold tracking-widest text-primary-600 uppercase">
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
    <span className="mb-1 text-xs font-medium tracking-wide text-muted uppercase">
      {label}
    </span>
    {SUPPORTED_LANGUAGES.map((lang) => {
      const isActive = lang === editingLanguage
      const isUser = lang === userLanguage
      const filled = hasContent(lang)
      const error = hasError(lang)

      return (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={clsx(
            'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors',
            isActive
              ? 'bg-primary-700/10 ring-1 ring-primary-700/20'
              : 'hover:bg-surface-subtle',
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
          {isUser && (
            <span className="text-[10px] text-primary-600">★</span>
          )}
          <span
            className={clsx('h-2 w-2 shrink-0 rounded-full', langDotClass(error, filled))}
          />
        </button>
      )
    })}
  </div>
)

// ─── Main form ────────────────────────────────────────────────────────────────

export const ServiceForm = ({
  mode,
  initialValues,
  initialCoverUrl,
  initialIconUrl,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: ServiceFormProps) => {
  const { t, language } = useServicesTranslation()
  const schema = useMemo(() => createServiceSchema(t.validation, language), [t.validation, language])

  const [editingLanguage, setEditingLanguage] = useState<Language>(language)
  const [pendingCover, setPendingCover] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [pendingIcon, setPendingIcon] = useState<File | null>(null)
  const [removeIcon, setRemoveIcon] = useState(false)
  const [activeStep, setActiveStep] = useState<StepId>('general')
  const [maxStep, setMaxStep] = useState(0)

  const emptyLocalized = useMemo(
    () => Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as Record<Language, string>,
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
  } = useForm<ServiceFormData>({
    resolver: zodResolver(schema) as Resolver<ServiceFormData>,
    mode: 'onTouched',
    defaultValues: {
      name: { ...emptyLocalized },
      shortDescription: { ...emptyLocalized },
      description: { ...emptyLocalized },
      pillars: [],
      tags: '',
      order: 0,
      isActive: true,
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const pillarsValue = useWatch({ control, name: 'pillars' })
  const isActiveValue = useWatch({ control, name: 'isActive' })
  const nameValues = useWatch({ control, name: 'name' })
  const sdValues = useWatch({ control, name: 'shortDescription' })

  const pillarOptions = PILLAR_VALUES.map((p) => ({
    value: p,
    label: t.pillars[p],
  }))

  const hasContent = (lang: Language): boolean =>
    !!(nameValues?.[lang]?.trim() || sdValues?.[lang]?.trim())

  type LangErrors = Record<Language, { message?: string } | undefined>
  const hasError = (lang: Language): boolean => {
    const ne = (errors.name as LangErrors)?.[lang]
    const sde = (errors.shortDescription as LangErrors)?.[lang]
    const de = (errors.description as LangErrors)?.[lang]
    return !!(ne ?? sde ?? de)
  }

  const nameError = (errors.name as LangErrors)?.[editingLanguage]?.message
  const sdError = (errors.shortDescription as LangErrors)?.[editingLanguage]?.message
  const descError = (errors.description as LangErrors)?.[editingLanguage]?.message

  const stepHasError = (step: StepId) =>
    STEP_FIELDS[step].some((f) => f in errors)

  const steps: WizardStep[] = [
    { id: 'general', label: t.form.sectionGeneral, error: stepHasError('general') },
    { id: 'content', label: t.form.sectionContent, error: stepHasError('content') },
    { id: 'media', label: t.form.sectionMedia, optional: true, error: stepHasError('media') },
  ]

  const reachedIndex = mode === 'edit' ? steps.length - 1 : maxStep

  const handleNext = async () => {
    const ok = await trigger(STEP_FIELDS[activeStep] as (keyof ServiceFormData)[])
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
    (data) => onSubmit(data, pendingCover, pendingIcon, removeCover, removeIcon),
    (formErrors) => {
      // Jump to the first step with an error
      for (const step of ['general', 'content', 'media'] as StepId[]) {
        if (STEP_FIELDS[step].some((f) => f in formErrors)) {
          setActiveStep(step)
          break
        }
      }
      // Switch to the first language with a name/sd error
      const nameErrs = formErrors.name as LangErrors | undefined
      if (nameErrs) {
        const errLang = SUPPORTED_LANGUAGES.find((l) => nameErrs[l])
        if (errLang) setEditingLanguage(errLang)
      }
    }
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

        {/* ── Main form (Wizard) ─────────────────────────────────── */}
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
            {/* ── Step 1: General ───────────────────────── */}
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
              <InputField
                label={t.form.slug}
                helperText={t.form.slugHint}
                variant={errors.slug ? 'error' : undefined}
                errorMessage={errors.slug?.message}
                {...register('slug')}
              />
            </div>

            {/* ── Step 2: Content ───────────────────────── */}
            <div hidden={activeStep !== 'content'} className="animate-tab-fade flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>
                    {t.form.description} <span className="text-red-500">*</span>
                  </SectionLabel>
                  <LangBadge lang={editingLanguage} />
                  <span className="text-xs text-muted">{NATIVE_LANGUAGE_NAMES[editingLanguage]}</span>
                </div>
                <TextArea
                  rows={6}
                  variant={descError ? 'error' : 'default'}
                  errorMessage={descError}
                  {...register(`description.${editingLanguage}`)}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
                <Select
                  label={t.form.pillars}
                  multiple
                  options={pillarOptions}
                  value={pillarsValue}
                  lang={language}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                    setValue('pillars', selected as typeof pillarsValue)
                  }}
                />
                <InputField
                  label={t.form.tags}
                  helperText={t.form.tagsHint}
                  {...register('tags')}
                />
              </div>
            </div>

            {/* ── Step 3: Media ─────────────────────────── */}
            <div hidden={activeStep !== 'media'} className="animate-tab-fade">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-3 lg:col-span-2">
                  <SectionLabel>{t.form.cover}</SectionLabel>
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
                  <div className="flex flex-col gap-3">
                    <SectionLabel>{t.form.icon}</SectionLabel>
                    <CoverPicker
                      variant="compact"
                      currentUrl={initialIconUrl}
                      uploadLabel={t.form.iconUploadLabel}
                      dragLabel={t.form.iconDragLabel}
                      browseLabel={t.form.iconBrowseLabel}
                      formatsHint={t.form.iconFormatsHint}
                      removeLabel={t.form.iconRemoveLabel}
                      accept={ICON_ACCEPT}
                      disabled={isSubmitting}
                      onChange={(file) => {
                        setPendingIcon(file)
                        if (file) setRemoveIcon(false)
                      }}
                      onRemove={() => {
                        setPendingIcon(null)
                        setRemoveIcon(true)
                      }}
                    />
                  </div>
                  <InputNumber
                    label={t.form.order}
                    min={0}
                    {...register('order')}
                  />
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
                </div>
              </div>
            </div>
          </Wizard>
        </div>

        {/* ── Language sidebar ──────────────────────────────────── */}
        <div className="w-full rounded-xl border border-border bg-surface p-4 lg:w-52 lg:shrink-0 lg:sticky lg:top-4">
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
