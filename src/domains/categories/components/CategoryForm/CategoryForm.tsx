import { useEffect, useMemo, useRef } from 'react'
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
  SectionLabel,
  LangTabs,
  LangBadge,
  TranslateSuggestButton,
} from '@/shared/ui'
import {
  requiredLabel,
  useTranslationSuggestion,
  useScopedEditingLanguage,
} from '@/shared/lib'
import { notify } from '@/shared/lib/notify'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useContentLanguages } from '@/domains/site-config'
import { useCategoriesTranslation } from '../../i18n'
import { useCategoriesForPicker } from '../../api/categories.queries'
import { createCategorySchema } from '../../model/category.schema'
import type { CategoryFormData } from '../../model/category.schema'
import type { Category } from '../../model/category.types'

export interface CategoryFormProps {
  mode: 'create' | 'edit'
  categoryId?: string
  initialValues?: Partial<CategoryFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: CategoryFormData) => void
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

function isDescendantOrSelf(
  candidateId: string,
  targetId: string,
  categories: Category[]
): boolean {
  if (candidateId === targetId) return true
  const byParent = new Map<string, Category[]>()
  for (const c of categories) {
    const key = c.parentId ?? ''
    byParent.set(key, [...(byParent.get(key) ?? []), c])
  }
  const stack = [...(byParent.get(targetId) ?? [])]
  while (stack.length > 0) {
    const next = stack.pop()!
    if (next.id === candidateId) return true
    stack.push(...(byParent.get(next.id) ?? []))
  }
  return false
}

export const CategoryForm = ({
  mode,
  categoryId,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: CategoryFormProps) => {
  const { t, language } = useCategoriesTranslation()
  const { languages } = useContentLanguages()
  const { editingLanguage, setEditingLanguage, defaultLanguage } =
    useScopedEditingLanguage(languages, language)
  const schema = useMemo(
    () => createCategorySchema(t.validation, defaultLanguage),
    [t.validation, defaultLanguage]
  )
  const { data: categoriesData } = useCategoriesForPicker()

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
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(schema) as Resolver<CategoryFormData>,
    mode: 'onTouched',
    defaultValues: {
      name: { ...emptyLocalized },
      slug: { ...emptyLocalized },
      parentId: '',
      order: 0,
      isActive: true,
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const nameValues = useWatch({ control, name: 'name' })
  const slugValues = useWatch({ control, name: 'slug' })
  const parentIdValue = useWatch({ control, name: 'parentId' })
  const isActiveValue = useWatch({ control, name: 'isActive' })

  // Per-language slug detach — mirrors services/portfolio: tracks which
  // languages the user has manually edited the slug for, so name changes
  // stop auto-filling the slug only for that language.
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

  const hasContent = (lang: Language): boolean => !!nameValues?.[lang]?.trim()
  const hasError = (lang: Language): boolean =>
    !!(errors.name as LangErrors)?.[lang]
  const nameError = (errors.name as LangErrors)?.[editingLanguage]?.message

  // AI translation suggestion — same criteria as Portfolio/Services: source
  // is always the editor's own current UI language, never a fixed one; no
  // button at all (not just disabled) when there's nothing to translate
  // from, or when viewing the source language's own tab.
  const translation = useTranslationSuggestion<{ name: string }>('categories')
  const canTranslate = editingLanguage !== language && hasContent(language)
  const handleSuggestTranslation = () => {
    translation.mutate(
      {
        sourceLanguage: language,
        targetLanguage: editingLanguage,
        fields: { name: nameValues?.[language] ?? '' },
      },
      {
        onSuccess: (result) => {
          setValue(`name.${editingLanguage}`, result.fields.name, {
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

  const availableParents = (categoriesData ?? []).filter(
    (c) =>
      !categoryId || !isDescendantOrSelf(c.id, categoryId, categoriesData ?? [])
  )
  const parentOptions = [
    { value: '', label: t.form.noParent },
    ...availableParents.map((c) => ({
      value: c.id,
      label: c.name[language] || c.name.en,
    })),
  ]

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionLabel>{t.form.tabTranslations}</SectionLabel>
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
          <InputField
            label={requiredLabel(t.form.name)}
            variant={nameError ? 'error' : undefined}
            errorMessage={nameError}
            {...register(`name.${editingLanguage}`)}
          />
        </div>

        <FormGrid>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <SectionLabel>{requiredLabel(t.form.slug)}</SectionLabel>
              <LangBadge lang={editingLanguage} />
            </div>
            <InputField
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
          <InputNumber label={t.form.order} min={0} {...register('order')} />
        </FormGrid>

        <Select
          label={t.form.parent}
          options={parentOptions}
          value={parentIdValue ?? ''}
          lang={language}
          onChange={(e) =>
            setValue('parentId', e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
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
