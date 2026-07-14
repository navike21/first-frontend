import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  InputField,
  Modal,
  TextArea,
  Select,
  CoverPicker,
  Wizard,
  SectionLabel,
  LangSidebar,
  LangBadge,
  type WizardStep,
} from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import {
  usePagesForPicker,
  useCategoriesForPagePicker,
  useTagsForPagePicker,
} from '../../api/pages.queries'
import { createPageSchema, PAGE_STATUS_VALUES } from '../../model/page.schema'
import type { PageFormData } from '../../model/page.schema'
import type { Page } from '../../model/page.types'
import {
  buildLengthMetric,
  META_TITLE_MIN,
  META_TITLE_MAX,
  META_DESCRIPTION_MIN,
  META_DESCRIPTION_MAX,
} from '../../model/page.seo'
import { SeoLengthBar, SeoSocialPreviews } from '../PageSeoPreview'

export interface PageFormProps {
  mode: 'create' | 'edit'
  pageId?: string
  initialValues?: Partial<PageFormData>
  initialCoverUrl?: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (
    data: PageFormData,
    cover?: File | null,
    removeCover?: boolean,
    ogImage?: File | null,
    coverLibraryUrl?: string
  ) => void
}

type StepId = 'general' | 'seo' | 'organization' | 'cover'

const STEP_FIELDS: Record<StepId, (keyof PageFormData)[]> = {
  general: ['title', 'slug', 'parentId'],
  seo: ['seoMetaTitle', 'seoMetaDescription', 'seoKeywords', 'seoOgImage'],
  organization: ['categoryIds', 'tagIds', 'status', 'scheduledAt'],
  cover: [],
}

type LangErrors = Record<Language, { message?: string } | undefined>

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

function isDescendantOrSelf(candidateId: string, targetId: string, pages: Page[]): boolean {
  if (candidateId === targetId) return true
  const byParent = new Map<string, Page[]>()
  for (const p of pages) {
    const key = p.parentId ?? ''
    byParent.set(key, [...(byParent.get(key) ?? []), p])
  }
  const stack = [...(byParent.get(targetId) ?? [])]
  while (stack.length > 0) {
    const next = stack.pop()!
    if (next.id === candidateId) return true
    stack.push(...(byParent.get(next.id) ?? []))
  }
  return false
}

function joinPath(parentPath: string, ownSlug: string): string {
  if (!ownSlug) return ''
  if (!parentPath) return ownSlug
  return `${parentPath}/${ownSlug}`
}

export const PageForm = ({
  mode,
  pageId,
  initialValues,
  initialCoverUrl,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: PageFormProps) => {
  const { t, language } = usePagesTranslation()
  const schema = useMemo(() => createPageSchema(t.validation, language), [t.validation, language])

  const { data: pagesData } = usePagesForPicker()
  const { data: categoriesData } = useCategoriesForPagePicker()
  const { data: tagsData } = useTagsForPagePicker()

  const [editingLanguage, setEditingLanguage] = useState<Language>(language)
  const [pendingCover, setPendingCover] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [coverLibraryUrl, setCoverLibraryUrl] = useState<string | null>(null)
  const [pendingOgImage, setPendingOgImage] = useState<File | null>(null)
  const [previewsOpen, setPreviewsOpen] = useState(false)
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
  } = useForm<PageFormData>({
    resolver: zodResolver(schema) as Resolver<PageFormData>,
    mode: 'onTouched',
    defaultValues: {
      title: { ...emptyLocalized },
      slug: { ...emptyLocalized },
      seoMetaTitle: { ...emptyLocalized },
      seoMetaDescription: { ...emptyLocalized },
      seoKeywords: { ...emptyLocalized },
      seoOgImage: '',
      parentId: '',
      status: 'draft',
      scheduledAt: '',
      categoryIds: [],
      tagIds: [],
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const titleValues = useWatch({ control, name: 'title' })
  const slugValues = useWatch({ control, name: 'slug' })
  const seoMetaTitleValues = useWatch({ control, name: 'seoMetaTitle' })
  const seoMetaDescValues = useWatch({ control, name: 'seoMetaDescription' })
  const seoKeywordsValues = useWatch({ control, name: 'seoKeywords' })
  const seoOgImageValue = useWatch({ control, name: 'seoOgImage' })
  const parentIdValue = useWatch({ control, name: 'parentId' })
  const categoryIdsValue = useWatch({ control, name: 'categoryIds' })
  const tagIdsValue = useWatch({ control, name: 'tagIds' })
  const statusValue = useWatch({ control, name: 'status' })
  const scheduledAtValue = useWatch({ control, name: 'scheduledAt' })

  // Slug auto-suggested per language from that language's title (mirrors
  // services/portfolio), detaching a language once its slug is edited by hand.
  const detachedRef = useRef<Partial<Record<Language, boolean>>>(
    Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, !!initialValues?.slug?.[l]?.trim()])),
  )

  useEffect(() => {
    for (const lang of SUPPORTED_LANGUAGES) {
      if (detachedRef.current[lang]) continue
      setValue(`slug.${lang}`, slugify(titleValues?.[lang] ?? ''), {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      })
    }
  }, [titleValues, setValue])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
    setValue(`slug.${editingLanguage}`, cleaned, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    detachedRef.current[editingLanguage] = !!cleaned
  }

  const availableParents = (pagesData ?? []).filter(
    (p) => !pageId || !isDescendantOrSelf(p.id, pageId, pagesData ?? []),
  )
  const parentOptions = [
    { value: '', label: t.form.noParent },
    ...availableParents.map((p) => ({ value: p.id, label: p.title[language] || p.title.en })),
  ]

  const selectedParent = availableParents.find((p) => p.id === parentIdValue)
  const pathPreview = joinPath(selectedParent?.fullPath?.[editingLanguage] ?? '', slugValues?.[editingLanguage] ?? '')

  // Live Yoast-style metrics + social previews for the language being edited:
  // they fall back to title/description exactly like the public renderer does.
  const liveTitle = (seoMetaTitleValues?.[editingLanguage] ?? '').trim() || (titleValues?.[editingLanguage] ?? '').trim()
  const liveDescription = (seoMetaDescValues?.[editingLanguage] ?? '').trim()
  const metaTitleMetric = buildLengthMetric(liveTitle.length, META_TITLE_MIN, META_TITLE_MAX)
  const metaDescriptionMetric = buildLengthMetric(liveDescription.length, META_DESCRIPTION_MIN, META_DESCRIPTION_MAX)

  const coverPreviewUrl = useMemo(() => (pendingCover ? URL.createObjectURL(pendingCover) : ''), [pendingCover])
  const ogPreviewUrl = useMemo(() => (pendingOgImage ? URL.createObjectURL(pendingOgImage) : ''), [pendingOgImage])
  useEffect(
    () => () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl)
    },
    [coverPreviewUrl],
  )
  useEffect(
    () => () => {
      if (ogPreviewUrl) URL.revokeObjectURL(ogPreviewUrl)
    },
    [ogPreviewUrl],
  )
  const socialPreviewImage =
    ogPreviewUrl ||
    (seoOgImageValue ?? '').trim() ||
    coverPreviewUrl ||
    coverLibraryUrl ||
    (removeCover ? '' : (initialCoverUrl ?? ''))

  const categoryOptions = (categoriesData ?? []).map((c) => ({
    value: c.id,
    label: c.name[language] || c.name.en,
  }))
  const tagOptions = (tagsData ?? []).map((tag) => ({
    value: tag.id,
    label: tag.name[language] || tag.name.en,
  }))
  const statusOptions = PAGE_STATUS_VALUES.map((s) => ({ value: s, label: t.status[s] }))

  const hasContent = (lang: Language): boolean => !!titleValues?.[lang]?.trim()
  const hasError = (lang: Language): boolean => {
    const te = (errors.title as LangErrors)?.[lang]
    const se = (errors.slug as LangErrors)?.[lang]
    return !!(te ?? se)
  }

  const titleError = (errors.title as LangErrors)?.[editingLanguage]?.message
  const slugError = (errors.slug as LangErrors)?.[editingLanguage]?.message

  const stepHasError = (step: StepId) => STEP_FIELDS[step].some((f) => f in errors)

  const steps: WizardStep[] = [
    { id: 'general', label: t.form.sectionGeneral, error: stepHasError('general') },
    { id: 'seo', label: t.form.sectionSeo, optional: true, error: stepHasError('seo') },
    { id: 'organization', label: t.form.sectionOrganization, error: stepHasError('organization') },
    { id: 'cover', label: t.form.sectionCover, optional: true, error: stepHasError('cover') },
  ]

  const reachedIndex = mode === 'edit' ? steps.length - 1 : maxStep

  const handleNext = async () => {
    const ok = await trigger(STEP_FIELDS[activeStep] as (keyof PageFormData)[])
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
    (data) => onSubmit(data, pendingCover, removeCover, pendingOgImage, coverLibraryUrl ?? undefined),
    (formErrors) => {
      for (const step of ['general', 'seo', 'organization', 'cover'] as StepId[]) {
        if (STEP_FIELDS[step].some((f) => f in formErrors)) {
          setActiveStep(step)
          break
        }
      }
      const titleErrs = formErrors.title as LangErrors | undefined
      if (titleErrs) {
        const errLang = SUPPORTED_LANGUAGES.find((l) => titleErrs[l])
        if (errLang) setEditingLanguage(errLang)
      }
    },
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
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
                    {t.form.title} <span className="text-red-500">*</span>
                  </SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField
                  variant={titleError ? 'error' : undefined}
                  errorMessage={titleError}
                  {...register(`title.${editingLanguage}`)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.slug}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <InputField
                  variant={slugError ? 'error' : undefined}
                  errorMessage={slugError}
                  value={slugValues?.[editingLanguage] ?? ''}
                  onChange={handleSlugChange}
                />
                {!slugError && (
                  <p className="mt-1 text-xs text-muted">
                    {t.form.slugHint}
                    {pathPreview && (
                      <>
                        {' — '}
                        {t.form.fullPathPreview}: <span className="font-mono text-secondary">/{pathPreview}</span>
                      </>
                    )}
                  </p>
                )}
              </div>
              <Select
                label={`${t.form.parent} ${t.form.optional}`}
                options={parentOptions}
                value={parentIdValue ?? ''}
                lang={language}
                onChange={(e) =>
                  setValue('parentId', e.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                }
              />
            </div>

            {/* Step 2 — SEO (page content itself lives in the future builder) */}
            <div hidden={activeStep !== 'seo'} className="animate-tab-fade flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <InputField
                  label={
                    <span className="flex items-center gap-2">
                      {t.form.metaTitle}
                      <LangBadge lang={editingLanguage} />
                    </span>
                  }
                  value={seoMetaTitleValues?.[editingLanguage] ?? ''}
                  onChange={(e) =>
                    setValue(`seoMetaTitle.${editingLanguage}`, e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                />
                <SeoLengthBar
                  metric={metaTitleMetric}
                  charsLabel={t.seo.charsCount(metaTitleMetric.length, metaTitleMetric.min, metaTitleMetric.max)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <TextArea
                  label={
                    <span className="flex items-center gap-2">
                      {t.form.metaDescription}
                      <LangBadge lang={editingLanguage} />
                    </span>
                  }
                  rows={2}
                  value={seoMetaDescValues?.[editingLanguage] ?? ''}
                  onChange={(e) =>
                    setValue(`seoMetaDescription.${editingLanguage}`, e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                />
                <SeoLengthBar
                  metric={metaDescriptionMetric}
                  charsLabel={t.seo.charsCount(
                    metaDescriptionMetric.length,
                    metaDescriptionMetric.min,
                    metaDescriptionMetric.max,
                  )}
                />
              </div>
              <InputField
                label={
                  <span className="flex items-center gap-2">
                    {t.form.keywords}
                    <LangBadge lang={editingLanguage} />
                  </span>
                }
                helperText={t.form.keywordsHint}
                value={seoKeywordsValues?.[editingLanguage] ?? ''}
                onChange={(e) =>
                  setValue(`seoKeywords.${editingLanguage}`, e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              <div className="flex flex-col gap-3">
                <SectionLabel>
                  {t.form.ogImage}{' '}
                  <span className="text-xs font-normal normal-case tracking-normal text-muted">{t.form.optional}</span>
                </SectionLabel>
                <CoverPicker
                  currentUrl={(seoOgImageValue ?? '').trim() || undefined}
                  uploadLabel={t.form.ogImageUploadLabel}
                  dragLabel={t.form.coverDragLabel}
                  dragOrLabel={t.form.coverDragOrLabel}
                  browseLabel={t.form.coverBrowseLabel}
                  formatsHint={t.form.coverFormatsHint}
                  removeLabel={t.form.ogImageRemoveLabel}
                  disabled={isSubmitting}
                  variant="compact"
                  onChange={(file) => setPendingOgImage(file)}
                  onRemove={() => {
                    setPendingOgImage(null)
                    setValue('seoOgImage', '', { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                  }}
                  onSelectLibrary={(file: StorageFile) => {
                    setPendingOgImage(null)
                    setValue('seoOgImage', file.original.url, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                  }}
                  libraryTexts={t.builder.mediaLibrary}
                />
              </div>
              <div>
                <Button type="button" variant="outline" size="small" onClick={() => setPreviewsOpen(true)}>
                  {t.seo.previewsTitle}
                </Button>
              </div>
            </div>

            {/* Step 3 — Organization */}
            <div hidden={activeStep !== 'organization'} className="animate-tab-fade flex flex-col gap-6">
              <Select
                label={`${t.form.categoryIds} ${t.form.optional}`}
                multiple
                options={categoryOptions}
                value={categoryIdsValue ?? []}
                lang={language}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                  setValue('categoryIds', selected, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                }}
              />
              <Select
                label={`${t.form.tagIds} ${t.form.optional}`}
                multiple
                options={tagOptions}
                value={tagIdsValue ?? []}
                lang={language}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                  setValue('tagIds', selected, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
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
              {statusValue === 'scheduled' && (
                <InputField
                  type="datetime-local"
                  label={t.form.scheduledAt}
                  variant={errors.scheduledAt ? 'error' : undefined}
                  errorMessage={errors.scheduledAt?.message}
                  value={scheduledAtValue ?? ''}
                  onChange={(e) =>
                    setValue('scheduledAt', e.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                  }
                />
              )}
            </div>

            {/* Step 4 — Cover */}
            <div hidden={activeStep !== 'cover'} className="animate-tab-fade">
              <div className="flex flex-col gap-3">
                <SectionLabel>
                  {t.form.cover} <span className="text-xs font-normal normal-case tracking-normal text-muted">{t.form.optional}</span>
                </SectionLabel>
                <CoverPicker
                  currentUrl={coverLibraryUrl ?? initialCoverUrl}
                  uploadLabel={t.form.coverUploadLabel}
                  dragLabel={t.form.coverDragLabel}
                  dragOrLabel={t.form.coverDragOrLabel}
                  browseLabel={t.form.coverBrowseLabel}
                  formatsHint={t.form.coverFormatsHint}
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
                  libraryTexts={t.builder.mediaLibrary}
                />
              </div>
            </div>
          </Wizard>
        </div>

        <Modal isOpen={previewsOpen} onClose={() => setPreviewsOpen(false)} size="lg" title={t.seo.previewsTitle}>
          <SeoSocialPreviews
            title={liveTitle}
            description={liveDescription}
            imageUrl={socialPreviewImage}
            path={pathPreview}
          />
        </Modal>

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
