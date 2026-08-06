import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  TextArea,
  RichTextArea,
  Select,
  CoverPicker,
  Wizard,
  SectionLabel,
  LangSidebar,
  LangTabs,
  LangBadge,
  TranslateSuggestButton,
  type WizardStep,
} from '@/shared/ui'
import { uploadEditorImage, resolveRichTextImages } from '@/shared/api/storage'
import type { StorageFile } from '@/shared/api/storage'
import {
  requiredLabel,
  useTranslationSuggestion,
  useScopedEditingLanguage,
} from '@/shared/lib'
import { notify } from '@/shared/lib/notify'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useContentLanguages } from '@/domains/site-config'
import { useBlogTranslation } from '../../i18n'
import {
  useCategoriesForBlogPicker,
  useTagsForBlogPicker,
  useCollaboratorsForBlogPicker,
} from '../../api/blog.queries'
import { createBlogPostSchema, BLOG_STATUS_VALUES } from '../../model/blog.schema'
import type { BlogFormData } from '../../model/blog.schema'
import type { BlogImageFiles } from '../../api/blog.api'

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

function stepHasMediaError(step: StepId, coverMissing: boolean): boolean {
  return step === 'publication' && coverMissing
}

function coverPickerMessages(
  coverMissing: boolean,
  formatsHint: string,
  requiredMessage: string
): { formatsHint?: string; errorMessage?: string } {
  return coverMissing ? { errorMessage: requiredMessage } : { formatsHint }
}

export interface BlogPostFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<BlogFormData>
  initialCoverUrl?: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (
    data: BlogFormData,
    files: BlogImageFiles,
    removeCover?: boolean,
    coverLibraryUrl?: string
  ) => void
}

type StepId = 'general' | 'content' | 'organization' | 'seo' | 'publication'

const STEP_FIELDS: Record<StepId, (keyof BlogFormData)[]> = {
  general: ['title', 'slug', 'excerpt'],
  content: ['content'],
  organization: ['categoryIds', 'tagIds', 'authorId'],
  seo: ['seoMetaTitle', 'seoMetaDescription', 'seoKeywords', 'seoOgImage'],
  publication: ['status', 'scheduledAt'],
}

type LangErrors = Record<Language, { message?: string } | undefined>

export const BlogPostForm = ({
  mode,
  initialValues,
  initialCoverUrl,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: BlogPostFormProps) => {
  const { t, language } = useBlogTranslation()
  const { languages } = useContentLanguages()
  const { editingLanguage, setEditingLanguage, defaultLanguage } =
    useScopedEditingLanguage(languages, language)
  const schema = useMemo(
    () => createBlogPostSchema(t.validation, defaultLanguage),
    [t.validation, defaultLanguage]
  )

  const { data: categoriesData } = useCategoriesForBlogPicker()
  const { data: tagsData } = useTagsForBlogPicker()
  const { data: collaboratorsData } = useCollaboratorsForBlogPicker()

  const [pendingCover, setPendingCover] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [coverLibraryUrl, setCoverLibraryUrl] = useState<string | null>(null)
  const [coverTouched, setCoverTouched] = useState(false)
  const [pendingOgImage, setPendingOgImage] = useState<File | null>(null)
  const [activeStep, setActiveStep] = useState<StepId>('general')
  const [maxStep, setMaxStep] = useState(0)

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
  } = useForm<BlogFormData>({
    resolver: zodResolver(schema) as Resolver<BlogFormData>,
    mode: 'onTouched',
    defaultValues: {
      title: { ...emptyLocalized },
      slug: { ...emptyLocalized },
      excerpt: { ...emptyLocalized },
      content: { ...emptyLocalized },
      categoryIds: [],
      tagIds: [],
      authorId: '',
      seoMetaTitle: { ...emptyLocalized },
      seoMetaDescription: { ...emptyLocalized },
      seoKeywords: { ...emptyLocalized },
      seoOgImage: '',
      status: 'draft',
      scheduledAt: '',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const titleValues = useWatch({ control, name: 'title' })
  const excerptValues = useWatch({ control, name: 'excerpt' })
  const contentValues = useWatch({ control, name: 'content' })
  const slugValues = useWatch({ control, name: 'slug' })
  const categoryIdsValue = useWatch({ control, name: 'categoryIds' })
  const tagIdsValue = useWatch({ control, name: 'tagIds' })
  const authorIdValue = useWatch({ control, name: 'authorId' })
  const seoMetaTitleValues = useWatch({ control, name: 'seoMetaTitle' })
  const seoMetaDescValues = useWatch({ control, name: 'seoMetaDescription' })
  const seoKeywordsValues = useWatch({ control, name: 'seoKeywords' })
  const seoOgImageValue = useWatch({ control, name: 'seoOgImage' })
  const statusValue = useWatch({ control, name: 'status' })
  const scheduledAtValue = useWatch({ control, name: 'scheduledAt' })

  // Per-language slug detach — mirrors portfolio/pages behavior
  const detachedRef = useRef<Set<Language>>(
    new Set(
      SUPPORTED_LANGUAGES.filter((l) => !!initialValues?.slug?.[l]?.trim())
    )
  )

  const currentTitleValue = titleValues?.[editingLanguage] ?? ''

  useEffect(() => {
    if (detachedRef.current.has(editingLanguage)) return
    setValue(`slug.${editingLanguage}`, slugify(currentTitleValue), {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    })
  }, [currentTitleValue, editingLanguage, setValue])

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

  const categoryOptions = (categoriesData ?? []).map((c) => ({
    value: c.id,
    label: c.name[language] || c.name.en,
  }))
  const tagOptions = (tagsData ?? []).map((tag) => ({
    value: tag.id,
    label: tag.name[language] || tag.name.en,
  }))
  const authorOptions = (collaboratorsData ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }))
  const statusOptions = BLOG_STATUS_VALUES.map((s) => ({
    value: s,
    label: t.status[s],
  }))

  const hasContent = (lang: Language): boolean =>
    !!(titleValues?.[lang]?.trim() || contentValues?.[lang]?.trim())

  const hasError = (lang: Language): boolean => {
    const te = (errors.title as LangErrors)?.[lang]
    const ce = (errors.content as LangErrors)?.[lang]
    const se = (errors.slug as LangErrors)?.[lang]
    return !!(te ?? ce ?? se)
  }

  const titleError = (errors.title as LangErrors)?.[editingLanguage]?.message
  const excerptError = (errors.excerpt as LangErrors)?.[editingLanguage]
    ?.message
  const contentError = (errors.content as LangErrors)?.[editingLanguage]
    ?.message

  // AI translation suggestion — the source is always the editor's own
  // current UI language (`language`, never a fixed one), the target is
  // whichever tab they're currently viewing. No button at all (not just
  // disabled) when there's nothing to translate from, or when viewing the
  // source language's own tab.
  const translation = useTranslationSuggestion<{
    title: string
    excerpt: string
    content: string
  }>('blog')
  const canTranslate = editingLanguage !== language && hasContent(language)
  const handleSuggestTranslation = () => {
    translation.mutate(
      {
        sourceLanguage: language,
        targetLanguage: editingLanguage,
        fields: {
          title: titleValues?.[language] ?? '',
          excerpt: excerptValues?.[language] ?? '',
          content: contentValues?.[language] ?? '',
        },
      },
      {
        onSuccess: (result) => {
          setValue(`title.${editingLanguage}`, result.fields.title, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
          setValue(`excerpt.${editingLanguage}`, result.fields.excerpt, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
          setValue(`content.${editingLanguage}`, result.fields.content, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
          notify.info(t.toasts.translationApplied)
        },
        onError: (error) => notify.queryError(error),
      }
    )
  }
  const translateButton = canTranslate ? (
    <TranslateSuggestButton
      label={t.form.suggestTranslation}
      loading={translation.isPending}
      onClick={handleSuggestTranslation}
    />
  ) : undefined

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
      error: stepHasError('content'),
    },
    {
      id: 'organization',
      label: t.form.sectionOrganization,
      error: stepHasError('organization'),
    },
    {
      id: 'seo',
      label: t.form.sectionSeo,
      optional: true,
      error: stepHasError('seo'),
    },
    {
      id: 'publication',
      label: t.form.sectionPublication,
      error: stepHasError('publication'),
    },
  ]

  const reachedIndex = mode === 'edit' ? steps.length - 1 : maxStep

  const handleNext = async () => {
    const ok = await trigger(STEP_FIELDS[activeStep] as (keyof BlogFormData)[])
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
        setActiveStep('publication')
        return
      }
      const resolvedContent = { ...data.content }
      await Promise.all(
        SUPPORTED_LANGUAGES.map(async (lang) => {
          if (resolvedContent[lang]) {
            resolvedContent[lang] = await resolveRichTextImages(
              resolvedContent[lang],
              uploadEditorImage
            )
          }
        })
      )
      onSubmit(
        { ...data, content: resolvedContent },
        { cover: pendingCover, ogImage: pendingOgImage },
        removeCover,
        coverLibraryUrl ?? undefined
      )
    },
    (formErrors) => {
      setCoverTouched(true)
      for (const step of [
        'general',
        'content',
        'organization',
        'seo',
        'publication',
      ] as StepId[]) {
        if (STEP_FIELDS[step].some((f) => f in formErrors)) {
          setActiveStep(step)
          break
        }
      }
      const titleErrs = formErrors.title as LangErrors | undefined
      if (titleErrs) {
        const errLang = languages.find((l) => titleErrs[l])
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
            extra={translateButton}
          />
        </div>
      )}
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
            {/* Step 1 — General */}
            <div
              hidden={activeStep !== 'general'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{requiredLabel(t.form.title)}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                  <span className="text-muted text-xs">
                    {NATIVE_LANGUAGE_NAMES[editingLanguage]}
                  </span>
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
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SectionLabel>{t.form.excerpt}</SectionLabel>
                  <LangBadge lang={editingLanguage} />
                </div>
                <TextArea
                  variant={excerptError ? 'error' : undefined}
                  errorMessage={excerptError}
                  rows={3}
                  value={excerptValues?.[editingLanguage] ?? ''}
                  onChange={(e) =>
                    setValue(`excerpt.${editingLanguage}`, e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                />
              </div>
            </div>

            {/* Step 2 — Content (RichTextArea, translated) */}
            <div
              hidden={activeStep !== 'content'}
              className="animate-tab-fade flex flex-col gap-6"
            >
              <RichTextArea
                label={
                  <span className="flex items-center gap-2">
                    {requiredLabel(t.form.content)}
                    <LangBadge lang={editingLanguage} />
                    <span className="text-muted text-xs font-normal tracking-normal normal-case">
                      {NATIVE_LANGUAGE_NAMES[editingLanguage]}
                    </span>
                  </span>
                }
                variant={contentError ? 'error' : 'default'}
                errorMessage={contentError}
                value={contentValues?.[editingLanguage] ?? ''}
                onChange={(html) =>
                  setValue(`content.${editingLanguage}`, html, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                disabled={isSubmitting}
                minRows={10}
              />
            </div>

            {/* Step 3 — Organization (categories, tags, author) */}
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
                label={t.form.authorId}
                options={[{ value: '', label: t.form.select }, ...authorOptions]}
                value={authorIdValue ?? ''}
                lang={language}
                texts={{ noOptionsFound: t.form.authorNoOptions }}
                variant={errors.authorId ? 'error' : undefined}
                errorMessage={errors.authorId?.message}
                onChange={(e) =>
                  setValue('authorId', e.target.value || '', {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
            </div>

            {/* Step 4 — SEO (optional) */}
            <div
              hidden={activeStep !== 'seo'}
              className="animate-tab-fade flex flex-col gap-6"
            >
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
                  setValue(
                    `seoMetaDescription.${editingLanguage}`,
                    e.target.value,
                    { shouldValidate: true, shouldDirty: true, shouldTouch: true }
                  )
                }
              />
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
                <SectionLabel>{t.form.ogImage}</SectionLabel>
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
                    setValue('seoOgImage', '', {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }}
                  onSelectLibrary={(file: StorageFile) => {
                    setPendingOgImage(null)
                    setValue('seoOgImage', file.original.url, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }}
                  libraryTexts={t.mediaLibrary}
                />
              </div>
            </div>

            {/* Step 5 — Publication (cover, status, scheduledAt) */}
            <div hidden={activeStep !== 'publication'} className="animate-tab-fade">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-3 lg:col-span-2">
                  <SectionLabel>{requiredLabel(t.form.cover)}</SectionLabel>
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
                  {statusValue === 'scheduled' && (
                    <InputField
                      type="datetime-local"
                      label={requiredLabel(t.form.scheduledAt)}
                      variant={errors.scheduledAt ? 'error' : undefined}
                      errorMessage={errors.scheduledAt?.message}
                      value={scheduledAtValue ?? ''}
                      onChange={(e) =>
                        setValue('scheduledAt', e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Wizard>
        </div>

        {/* ── Language sidebar ──────────────────────────────────── */}
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
              extra={translateButton}
            />
          </div>
        )}
      </div>
    </form>
  )
}
