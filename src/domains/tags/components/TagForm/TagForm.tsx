import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputField, InputNumber, Switch, Button, FormGrid, SectionLabel, LangTabs } from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useTagsTranslation } from '../../i18n'
import { createTagSchema } from '../../model/tag.schema'
import type { TagFormData } from '../../model/tag.schema'

export interface TagFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<TagFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: TagFormData) => void
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

export const TagForm = ({ mode, initialValues, isSubmitting, submitError, onCancel, onSubmit }: TagFormProps) => {
  const { t, language } = useTagsTranslation()
  const schema = useMemo(() => createTagSchema(t.validation, language), [t.validation, language])

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
  } = useForm<TagFormData>({
    resolver: zodResolver(schema) as Resolver<TagFormData>,
    mode: 'onTouched',
    defaultValues: {
      name: { ...emptyLocalized },
      slug: '',
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
