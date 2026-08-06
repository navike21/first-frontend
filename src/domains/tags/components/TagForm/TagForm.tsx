import { useEffect, useMemo, useRef } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputNumber,
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

export const TagForm = ({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: TagFormProps) => {
  const { t, language } = useTagsTranslation()
  const { languages } = useContentLanguages()
  const { editingLanguage, setEditingLanguage, defaultLanguage } =
    useScopedEditingLanguage(languages, language)
  const schema = useMemo(
    () => createTagSchema(t.validation, defaultLanguage),
    [t.validation, defaultLanguage]
  )

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
  } = useForm<TagFormData>({
    resolver: zodResolver(schema) as Resolver<TagFormData>,
    mode: 'onTouched',
    defaultValues: {
      name: { ...emptyLocalized },
      slug: { ...emptyLocalized },
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
  const translation = useTranslationSuggestion<{ name: string }>('tags')
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

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
        <div className="flex flex-col gap-3">
          {languages.length > 1 && (
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
          )}
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
