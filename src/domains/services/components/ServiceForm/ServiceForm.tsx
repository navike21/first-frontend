import { useEffect, useMemo, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import {
  InputField,
  InputNumber,
  Select,
  Switch,
  TextArea,
  CoverPicker,
  Tabs,
  Wizard,
  type WizardStep,
  type TabItem,
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold tracking-wide text-muted uppercase">{children}</p>
)

const LangBadge = ({ lang }: { lang: Language }) => (
  <span className="inline-flex h-5 items-center rounded bg-primary-700/10 px-1.5 text-[10px] font-semibold tracking-widest text-primary-600 uppercase">
    {lang}
  </span>
)

function buildLangTabs(otherLangs: Language[]): TabItem[] {
  return otherLangs.map((l) => ({
    id: l,
    label: l.toUpperCase(),
  }))
}

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

  const [pendingCover, setPendingCover] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [pendingIcon, setPendingIcon] = useState<File | null>(null)
  const [removeIcon, setRemoveIcon] = useState(false)

  const [activeStep, setActiveStep] = useState<StepId>('general')
  const [maxStep, setMaxStep] = useState(0)

  const otherLangs = useMemo(
    () => SUPPORTED_LANGUAGES.filter((l) => l !== language),
    [language]
  )
  const langTabs = useMemo(() => buildLangTabs(otherLangs), [otherLangs])

  // Separate tab states per step to avoid Framer Motion LayoutGroup conflicts
  const [activeLangTabGeneral, setActiveLangTabGeneral] = useState<Language>(otherLangs[0])
  const [activeLangTabContent, setActiveLangTabContent] = useState<Language>(otherLangs[0])

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
    watch,
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

  const pillarsValue = watch('pillars')
  const isActiveValue = watch('isActive')

  const pillarOptions = PILLAR_VALUES.map((p) => ({
    value: p,
    label: t.pillars[p],
  }))

  const submit = handleSubmit(
    (data) => onSubmit(data, pendingCover, pendingIcon, removeCover, removeIcon),
    (formErrors) => {
      const steps: StepId[] = ['general', 'content', 'media']
      for (const step of steps) {
        const keys = Object.keys(formErrors)
        if (STEP_FIELDS[step].some((f) => keys.includes(f))) {
          setActiveStep(step)
          break
        }
      }
    }
  )

  const stepHasError = (step: StepId) => {
    const keys = Object.keys(errors)
    return STEP_FIELDS[step].some((f) => keys.includes(f))
  }

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
      const nextIndex = i + 1
      setActiveStep(steps[nextIndex].id as StepId)
      setMaxStep((m) => Math.max(m, nextIndex))
    }
  }

  const handleBack = () => {
    const i = steps.findIndex((s) => s.id === activeStep)
    if (i > 0) setActiveStep(steps[i - 1].id as StepId)
  }

  const nameError = (lang: Language) => (errors.name as Record<string, { message?: string }>)?.[lang]?.message
  const sdError = (lang: Language) => (errors.shortDescription as Record<string, { message?: string }>)?.[lang]?.message
  const descError = (lang: Language) => (errors.description as Record<string, { message?: string }>)?.[lang]?.message

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="rounded-xl border border-border bg-surface p-6">
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
          {/* ── Step 1: General ─────────────────────────────────── */}
          <div hidden={activeStep !== 'general'} className="animate-tab-fade flex flex-col gap-8">
            {/* Primary language fields */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.name} <span className="text-red-500">*</span></SectionLabel>
                  <LangBadge lang={language} />
                  <span className="text-xs text-muted">{NATIVE_LANGUAGE_NAMES[language]}</span>
                </div>
                <InputField
                  variant={nameError(language) ? 'error' : undefined}
                  errorMessage={nameError(language)}
                  {...register(`name.${language}`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.shortDescription} <span className="text-red-500">*</span></SectionLabel>
                  <LangBadge lang={language} />
                </div>
                <InputField
                  variant={sdError(language) ? 'error' : undefined}
                  errorMessage={sdError(language)}
                  {...register(`shortDescription.${language}`)}
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

            {/* Translations tabs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <SectionLabel>{t.form.tabTranslations}</SectionLabel>
                <span className="text-xs text-muted">({otherLangs.length})</span>
              </div>
              <div className={clsx('rounded-xl border border-border bg-surface-subtle p-4 flex flex-col gap-4')}>
                <Tabs
                  instanceId="general-lang"
                  tabs={langTabs}
                  activeId={activeLangTabGeneral}
                  onChange={(id) => setActiveLangTabGeneral(id as Language)}
                  ariaLabel={t.form.tabTranslations}
                />
                {otherLangs.map((lang) => (
                  <div
                    key={lang}
                    hidden={activeLangTabGeneral !== lang}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <LangBadge lang={lang} />
                      <span className="text-xs text-muted">{NATIVE_LANGUAGE_NAMES[lang]}</span>
                    </div>
                    <InputField
                      label={t.form.name}
                      variant={nameError(lang) ? 'error' : undefined}
                      errorMessage={nameError(lang)}
                      {...register(`name.${lang}`)}
                    />
                    <InputField
                      label={t.form.shortDescription}
                      variant={sdError(lang) ? 'error' : undefined}
                      errorMessage={sdError(lang)}
                      {...register(`shortDescription.${lang}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Step 2: Content ──────────────────────────────────── */}
          <div hidden={activeStep !== 'content'} className="animate-tab-fade flex flex-col gap-8">
            {/* Primary language description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <SectionLabel>{t.form.description} <span className="text-red-500">*</span></SectionLabel>
                <LangBadge lang={language} />
                <span className="text-xs text-muted">{NATIVE_LANGUAGE_NAMES[language]}</span>
              </div>
              <TextArea
                rows={6}
                variant={descError(language) ? 'error' : 'default'}
                errorMessage={descError(language)}
                {...register(`description.${language}`)}
              />
            </div>

            {/* Description translations tabs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <SectionLabel>{t.form.tabTranslations}</SectionLabel>
              </div>
              <div className="rounded-xl border border-border bg-surface-subtle p-4 flex flex-col gap-4">
                <Tabs
                  instanceId="content-lang"
                  tabs={langTabs}
                  activeId={activeLangTabContent}
                  onChange={(id) => setActiveLangTabContent(id as Language)}
                  ariaLabel={t.form.tabTranslations}
                />
                {otherLangs.map((lang) => (
                  <div key={lang} hidden={activeLangTabContent !== lang} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <LangBadge lang={lang} />
                      <span className="text-xs text-muted">{NATIVE_LANGUAGE_NAMES[lang]}</span>
                    </div>
                    <TextArea
                      rows={5}
                      variant={descError(lang) ? 'error' : 'default'}
                      errorMessage={descError(lang)}
                      {...register(`description.${lang}`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pillars & Tags */}
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

          {/* ── Step 3: Configuración ───────────────────────────────── */}
          <div hidden={activeStep !== 'media'} className="animate-tab-fade">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Portada — ocupa 2/3 en desktop */}
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

              {/* Columna derecha: ícono + orden + activo */}
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
    </form>
  )
}
