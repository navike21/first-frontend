import { useState, useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import {
  InputField,
  InputNumber,
  RichTextArea,
  Select,
  Switch,
  PhotoPicker,
  Button,
  FormGrid,
  SectionLabel,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useConfigData } from '@/shared/api/config'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useCollaboratorsTranslation } from '../../i18n'
import { useUsersForCollaboratorPicker, useLinkedUserIds } from '../../api/collaborators.queries'
import { createCollaboratorSchema } from '../../model/collaborator.schema'
import type { CollaboratorFormData } from '../../model/collaborator.schema'

export interface CollaboratorFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<CollaboratorFormData>
  currentPhotoUrl?: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: CollaboratorFormData, photo?: File | null, removePhoto?: boolean) => void
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
            // Layout
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1',
            // Visual
            'text-xs font-semibold uppercase tracking-wider',
            // Transitions
            'transition-colors',
            // Conditionals
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

export const CollaboratorForm = ({
  mode,
  initialValues,
  currentPhotoUrl,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: CollaboratorFormProps) => {
  const { t, language } = useCollaboratorsTranslation()
  const schema = useMemo(() => createCollaboratorSchema(t.validation, language), [t.validation, language])
  const { data: usersData } = useUsersForCollaboratorPicker()
  const { data: linkedUserIds } = useLinkedUserIds()
  const { data: configData } = useConfigData(['collaboratorRoles', 'collaboratorLevels'], language)

  const [editingLanguage, setEditingLanguage] = useState<Language>(language)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)

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
  } = useForm<CollaboratorFormData>({
    resolver: zodResolver(schema) as Resolver<CollaboratorFormData>,
    mode: 'onTouched',
    defaultValues: {
      name: '',
      role: '',
      level: '',
      bio: { ...emptyLocalized },
      photoUrl: '',
      socialLinks: { linkedin: '', twitter: '', github: '', website: '', instagram: '' },
      userId: '',
      order: 0,
      isActive: true,
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const bioValues = useWatch({ control, name: 'bio' })
  const roleValue = useWatch({ control, name: 'role' })
  const levelValue = useWatch({ control, name: 'level' })
  const userIdValue = useWatch({ control, name: 'userId' })
  const isActiveValue = useWatch({ control, name: 'isActive' })

  const hasContent = (lang: Language): boolean => !!bioValues?.[lang]?.trim()

  const hasError = (lang: Language): boolean => !!(errors.bio as LangErrors)?.[lang]

  const bioError = (errors.bio as LangErrors)?.[editingLanguage]?.message

  const roleOptions = (configData?.collaboratorRoles ?? []).map((o) => ({ value: o.value, label: o.label }))
  const levelOptions = (configData?.collaboratorLevels ?? []).map((o) => ({ value: o.value, label: o.label }))

  // A linked collaborator mirrors the system user: name and photo come from
  // the account, so both lock while a user is selected. The link itself is
  // immutable once the collaborator exists (edit mode).
  const isLinked = !!userIdValue
  const linkedUser = (usersData ?? []).find((u) => u.id === userIdValue)

  const unlinkedDisplayUrl = removePhoto || pendingFile ? undefined : currentPhotoUrl
  const currentDisplayUrl = isLinked ? linkedUser?.profilePictureUrl || currentPhotoUrl : unlinkedDisplayUrl

  const handlePhotoChange = (file: File | null) => {
    setPendingFile(file)
    setRemovePhoto(false)
  }

  const handleRemovePhoto = () => {
    setPendingFile(null)
    setRemovePhoto(true)
  }

  // Each system user can back at most one collaborator: users already linked
  // elsewhere are excluded (the currently linked one stays so its label shows).
  const availableUsers = (usersData ?? []).filter(
    (u) => !linkedUserIds?.includes(u.id) || u.id === initialValues?.userId,
  )
  const userOptions = [
    { value: '', label: t.form.noLinkedUser },
    ...availableUsers.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })),
  ]

  const handleUserChange = (userId: string) => {
    setValue('userId', userId, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    const user = usersData?.find((u) => u.id === userId)
    if (!user) return
    setValue('name', `${user.firstName} ${user.lastName}`, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    setValue('photoUrl', user.profilePictureUrl ?? '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    setPendingFile(null)
    setRemovePhoto(false)
  }

  const submit = handleSubmit((data) =>
    onSubmit(data, isLinked ? null : pendingFile, isLinked ? false : removePhoto),
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6">
        {/* Linked account — first, so picking one can prefill the rest */}
        <div className="flex flex-col gap-3">
          <SectionLabel>{t.form.sectionAccount}</SectionLabel>
          <Select
            label={`${t.form.linkedUser} ${t.form.optional}`}
            helperText={t.form.linkedUserHint}
            options={userOptions}
            value={userIdValue ?? ''}
            lang={language}
            disabled={mode === 'edit' || isSubmitting}
            onChange={(e) => handleUserChange(e.target.value)}
          />
        </div>

        {/* Photo — centered */}
        <div className="flex justify-center">
          <PhotoPicker
            currentUrl={currentDisplayUrl}
            uploadLabel={t.form.uploadPhoto}
            formatsHint={t.form.uploadFormats}
            onChange={handlePhotoChange}
            onRemove={!isLinked && (currentPhotoUrl || pendingFile) ? handleRemovePhoto : undefined}
            removeLabel={t.form.removePhoto}
            disabled={isSubmitting || isLinked}
          />
        </div>

        {/* Name + order */}
        <FormGrid>
          <InputField
            label={requiredLabel(t.form.name)}
            variant={errors.name ? 'error' : undefined}
            errorMessage={errors.name?.message}
            disabled={mode === 'edit' || isLinked}
            {...register('name')}
          />
          <InputNumber label={t.form.order} min={0} {...register('order')} />
        </FormGrid>

        {/* Role + Level */}
        <FormGrid>
          <Select
            label={requiredLabel(t.form.role)}
            options={roleOptions}
            value={roleValue ?? ''}
            lang={language}
            placeholder={t.form.select}
            variant={errors.role ? 'error' : undefined}
            errorMessage={errors.role?.message}
            onChange={(e) =>
              setValue('role', e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
          <Select
            label={`${t.form.level} ${t.form.optional}`}
            options={[{ value: '', label: t.form.select }, ...levelOptions]}
            value={levelValue ?? ''}
            lang={language}
            onChange={(e) =>
              setValue('level', e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
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

        {/* Bio — localized, with a compact language switcher */}
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
          <RichTextArea
            label={requiredLabel(t.form.bio)}
            variant={bioError ? 'error' : 'default'}
            errorMessage={bioError}
            value={bioValues?.[editingLanguage] ?? ''}
            onChange={(html) =>
              setValue(`bio.${editingLanguage}`, html, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
        </div>

        {/* Social links */}
        <div className="flex flex-col gap-3">
          <SectionLabel>
            {t.form.sectionSocial}{' '}
            <span className="text-xs font-normal normal-case tracking-normal text-muted">
              {t.form.optional}
            </span>
          </SectionLabel>
          <FormGrid className="lg:grid-cols-2">
            <InputField
              label={t.form.linkedin}
              variant={errors.socialLinks?.linkedin ? 'error' : undefined}
              errorMessage={errors.socialLinks?.linkedin?.message}
              {...register('socialLinks.linkedin')}
            />
            <InputField
              label={t.form.twitter}
              variant={errors.socialLinks?.twitter ? 'error' : undefined}
              errorMessage={errors.socialLinks?.twitter?.message}
              {...register('socialLinks.twitter')}
            />
            <InputField
              label={t.form.github}
              variant={errors.socialLinks?.github ? 'error' : undefined}
              errorMessage={errors.socialLinks?.github?.message}
              {...register('socialLinks.github')}
            />
            <InputField
              label={t.form.website}
              variant={errors.socialLinks?.website ? 'error' : undefined}
              errorMessage={errors.socialLinks?.website?.message}
              {...register('socialLinks.website')}
            />
            <InputField
              label={t.form.instagram}
              variant={errors.socialLinks?.instagram ? 'error' : undefined}
              errorMessage={errors.socialLinks?.instagram?.message}
              {...register('socialLinks.instagram')}
            />
          </FormGrid>
        </div>

        {/* Footer */}
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
