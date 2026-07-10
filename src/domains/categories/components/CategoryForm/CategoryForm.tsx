import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { InputField, InputNumber, Select, Switch, Button, FormGrid, SectionLabel } from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
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

const langDotClass = (error: boolean, filled: boolean): string => {
  if (error) return 'bg-red-500'
  if (filled) return 'bg-emerald-500'
  return 'bg-border'
}

interface LangTabsProps {
  editingLanguage: Language
  userLanguage: Language
  hasContent: (lang: Language) => boolean
  hasError: (lang: Language) => boolean
  onChange: (lang: Language) => void
}

const LangTabs = ({ editingLanguage, userLanguage, hasContent, hasError, onChange }: LangTabsProps) => (
  <div className="flex flex-wrap gap-1.5">
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
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1',
            'text-xs font-semibold uppercase tracking-wider',
            'transition-colors',
            isActive
              ? 'bg-primary-700/10 text-primary-600 ring-1 ring-primary-700/20'
              : 'bg-surface-subtle text-muted hover:text-foreground',
          )}
        >
          {lang}
          {lang === userLanguage && <span className="text-[10px] text-primary-600">★</span>}
          <span className={clsx('h-1.5 w-1.5 rounded-full', langDotClass(error, filled))} />
        </button>
      )
    })}
  </div>
)

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

function isDescendantOrSelf(candidateId: string, targetId: string, categories: Category[]): boolean {
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
  const schema = useMemo(() => createCategorySchema(t.validation, language), [t.validation, language])
  const { data: categoriesData } = useCategoriesForPicker()

  const [editingLanguage, setEditingLanguage] = useState<Language>(language)

  const emptyLocalized = useMemo(
    () => Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as Record<Language, string>,
    [],
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
      slug: '',
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
  const slugValue = useWatch({ control, name: 'slug' })
  const parentIdValue = useWatch({ control, name: 'parentId' })
  const isActiveValue = useWatch({ control, name: 'isActive' })

  // Slug auto-suggested from the name in the user's own UI language (mirrors
  // services/portfolio), detaching once the user edits the slug by hand.
  const detachedRef = useRef(!!initialValues?.slug?.trim())
  const currentNameValue = nameValues?.[language] ?? ''

  useEffect(() => {
    if (detachedRef.current) return
    setValue('slug', slugify(currentNameValue), { shouldValidate: false, shouldDirty: false, shouldTouch: false })
  }, [currentNameValue, setValue])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
    setValue('slug', cleaned, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    detachedRef.current = !!cleaned
  }

  const hasContent = (lang: Language): boolean => !!nameValues?.[lang]?.trim()
  const hasError = (lang: Language): boolean => !!(errors.name as LangErrors)?.[lang]
  const nameError = (errors.name as LangErrors)?.[editingLanguage]?.message

  const availableParents = (categoriesData ?? []).filter(
    (c) => !categoryId || !isDescendantOrSelf(c.id, categoryId, categoriesData ?? []),
  )
  const parentOptions = [
    { value: '', label: t.form.noParent },
    ...availableParents.map((c) => ({ value: c.id, label: c.name[language] || c.name.en })),
  ]

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionLabel>{t.form.tabTranslations}</SectionLabel>
            <LangTabs
              editingLanguage={editingLanguage}
              userLanguage={language}
              hasContent={hasContent}
              hasError={hasError}
              onChange={setEditingLanguage}
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
          <InputField
            label={requiredLabel(t.form.slug)}
            variant={errors.slug ? 'error' : undefined}
            errorMessage={errors.slug?.message}
            value={slugValue ?? ''}
            onChange={handleSlugChange}
          />
          <InputNumber label={t.form.order} min={0} {...register('order')} />
        </FormGrid>

        <Select
          label={`${t.form.parent} ${t.form.optional}`}
          options={parentOptions}
          value={parentIdValue ?? ''}
          lang={language}
          onChange={(e) =>
            setValue('parentId', e.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
          }
        />

        <Switch
          label={t.form.isActive}
          checked={isActiveValue}
          onChange={(e) =>
            setValue('isActive', e.target.checked, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
          }
          disabled={isSubmitting}
        />

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
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
        </div>
      </div>
    </form>
  )
}
