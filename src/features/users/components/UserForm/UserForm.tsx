import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputField, Select } from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { useUsersTranslation } from '../../i18n'
import { createCreateUserSchema, createUpdateUserSchema } from '../../model/user.schema'
import type { CreateUserFormData, UpdateUserFormData } from '../../model/user.schema'
import type { User } from '../../model/user.types'
import { useUserConfigStore } from '../../model/userConfig.store'
import { PhotoPicker } from '@/features/storage/components/PhotoPicker/PhotoPicker'
import { uploadFile } from '@/features/storage/api/storage.api'

type Mode = 'create' | 'edit'

interface UserFormProps {
  mode: Mode
  defaultValues?: Partial<User>
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserFormData) => void
  onUpdate: (data: UpdateUserFormData) => void
}

// ─── Shared upload hook ───────────────────────────────────────────────────────

function usePhotoUpload() {
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadIfNeeded = async (entityId: string): Promise<string | undefined> => {
    if (!pendingFile) return undefined
    setIsUploading(true)
    try {
      const result = await uploadFile(pendingFile, 'user-profile', entityId)
      return result.full?.url ?? result.original.url
    } finally {
      setIsUploading(false)
    }
  }

  return { pendingFile, setPendingFile, isUploading, uploadIfNeeded }
}

// ─── Shared layout ────────────────────────────────────────────────────────────

const PanelLayout = ({ left, right }: { left: React.ReactNode; right: React.ReactNode }) => (
  <div className="flex items-start gap-5">
    <div className="flex w-60 shrink-0 flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-6">
      {left}
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6">
      {right}
    </div>
  </div>
)

// ─── Create ──────────────────────────────────────────────────────────────────

interface CreateFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserFormData) => void
}

const CreateForm = ({ isSubmitting, onCancel, onCreate }: CreateFormProps) => {
  const { t } = useUsersTranslation()
  const { userGroups, load } = useUserConfigStore()
  const schema = useMemo(() => createCreateUserSchema(t.validation), [t.validation])
  const { setPendingFile, isUploading, uploadIfNeeded } = usePhotoUpload()

  useEffect(() => {
    void load()
  }, [load])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active' },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const groupValue = useWatch({ control, name: 'groupId' })

  const genderLabel: Record<string, string> = {
    female: t.form.genderFemale,
    male: t.form.genderMale,
    other: t.form.genderOther,
    prefer_not_to_say: t.form.genderPreferNotToSay,
  }

  const groupOptions = userGroups
    .filter((g) => g.status === 'active')
    .map((g) => ({ value: g.id, label: g.name }))

  const busy = isSubmitting || isUploading

  const onSubmit = async (data: CreateUserFormData) => {
    let profilePictureUrl = data.profilePictureUrl ?? ''
    try {
      const uploaded = await uploadIfNeeded(crypto.randomUUID())
      if (uploaded) profilePictureUrl = uploaded
    } catch (err) {
      notify.error(err instanceof Error ? err.message : 'Upload failed')
      return
    }
    onCreate({ ...data, profilePictureUrl })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PanelLayout
        left={
          <PhotoPicker
            uploadLabel={t.form.uploadPhoto}
            formatsHint={t.form.uploadFormats}
            onChange={setPendingFile}
            disabled={busy}
          />
        }
        right={
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.firstName}
                placeholder={t.form.firstNamePlaceholder}
                variant={errors.firstName ? 'error' : undefined}
                errorMessage={errors.firstName?.message}
                {...register('firstName')}
              />
              <InputField
                label={t.form.lastName}
                placeholder={t.form.lastNamePlaceholder}
                variant={errors.lastName ? 'error' : undefined}
                errorMessage={errors.lastName?.message}
                {...register('lastName')}
              />
              <InputField
                label={t.form.email}
                type="email"
                placeholder={t.form.emailPlaceholder}
                variant={errors.email ? 'error' : undefined}
                errorMessage={errors.email?.message}
                {...register('email')}
              />
              <InputField
                label={t.form.password}
                type="password"
                placeholder={t.form.passwordPlaceholder}
                variant={errors.password ? 'error' : undefined}
                errorMessage={errors.password?.message}
                {...register('password')}
              />
              <InputField
                label={t.form.phone}
                placeholder={t.form.phonePlaceholder}
                variant={errors.phone ? 'error' : undefined}
                errorMessage={errors.phone?.message}
                {...register('phone')}
              />
              <InputField
                label={t.form.dateOfBirth}
                placeholder={t.form.dateOfBirthPlaceholder}
                variant={errors.dateOfBirth ? 'error' : undefined}
                errorMessage={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
              <Select
                label={t.form.gender}
                options={Object.entries(genderLabel).map(([v, l]) => ({ value: v, label: l }))}
                value={genderValue ?? ''}
                onChange={(e) => setValue('gender', e.target.value as CreateUserFormData['gender'])}
                placeholder={t.form.genderPlaceholder}
              />
              {groupOptions.length > 0 ? (
                <Select
                  label={t.form.groupId}
                  options={groupOptions}
                  value={groupValue ?? ''}
                  onChange={(e) => setValue('groupId', e.target.value)}
                  placeholder={t.form.groupIdPlaceholder}
                />
              ) : (
                <div />
              )}
            </div>

            <p className="text-sm font-medium text-slate-600">{t.form.addressSection}</p>
            <InputField
              label={t.form.addressStreet}
              placeholder={t.form.addressStreetPlaceholder}
              {...register('address.street')}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.addressCity}
                placeholder={t.form.addressCityPlaceholder}
                {...register('address.city')}
              />
              <InputField
                label={t.form.addressState}
                placeholder={t.form.addressStatePlaceholder}
                {...register('address.state')}
              />
              <InputField
                label={t.form.addressCountry}
                placeholder={t.form.addressCountryPlaceholder}
                {...register('address.country')}
              />
              <InputField
                label={t.form.addressPostalCode}
                placeholder={t.form.addressPostalCodePlaceholder}
                {...register('address.postalCode')}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                type="button"
                disabled={busy}
                onClick={() => {
                  reset()
                  onCancel()
                }}
              >
                {t.form.cancelButton}
              </Button>
              <Button variant="primary" type="submit" loading={busy}>
                {t.form.createButton}
              </Button>
            </div>
          </>
        }
      />
    </form>
  )
}

// ─── Edit ─────────────────────────────────────────────────────────────────────

interface EditFormProps {
  defaultValues: Partial<User>
  isSubmitting: boolean
  onCancel: () => void
  onUpdate: (data: UpdateUserFormData) => void
}

const EditForm = ({ defaultValues, isSubmitting, onCancel, onUpdate }: EditFormProps) => {
  const { t } = useUsersTranslation()
  const { userGroups, load } = useUserConfigStore()
  const schema = useMemo(() => createUpdateUserSchema(t.validation), [t.validation])
  const { setPendingFile, isUploading, uploadIfNeeded } = usePhotoUpload()

  useEffect(() => {
    void load()
  }, [load])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: defaultValues.firstName ?? '',
      lastName: defaultValues.lastName ?? '',
      phone: defaultValues.phone ?? '',
      dateOfBirth: defaultValues.dateOfBirth ?? '',
      gender: defaultValues.gender,
      groupId: defaultValues.groupId ?? '',
      address: defaultValues.address ?? {},
      status: defaultValues.status === 'deleted' ? 'inactive' : (defaultValues.status ?? 'active'),
    },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const groupValue = useWatch({ control, name: 'groupId' })
  const statusValue = useWatch({ control, name: 'status' })

  const genderLabel: Record<string, string> = {
    female: t.form.genderFemale,
    male: t.form.genderMale,
    other: t.form.genderOther,
    prefer_not_to_say: t.form.genderPreferNotToSay,
  }

  const groupOptions = userGroups
    .filter((g) => g.status === 'active')
    .map((g) => ({ value: g.id, label: g.name }))

  const busy = isSubmitting || isUploading

  const onSubmit = async (data: UpdateUserFormData) => {
    let profilePictureUrl = defaultValues.profilePictureUrl ?? ''
    try {
      const entityId = defaultValues.id ?? crypto.randomUUID()
      const uploaded = await uploadIfNeeded(entityId)
      if (uploaded) profilePictureUrl = uploaded
    } catch (err) {
      notify.error(err instanceof Error ? err.message : 'Upload failed')
      return
    }
    onUpdate({ ...data, profilePictureUrl })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PanelLayout
        left={
          <>
            <PhotoPicker
              currentUrl={defaultValues.profilePictureUrl}
              uploadLabel={t.form.uploadPhoto}
              formatsHint={t.form.uploadFormats}
              onChange={setPendingFile}
              disabled={busy}
            />
            <div className="w-full border-t border-slate-200 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.form.statusLabel}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{t.form.statusDescription}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={statusValue === 'active'}
                  disabled={busy}
                  onClick={() =>
                    setValue('status', statusValue === 'active' ? 'inactive' : 'active')
                  }
                  className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                    statusValue === 'active' ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      statusValue === 'active' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        }
        right={
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.firstName}
                placeholder={t.form.firstNamePlaceholder}
                variant={errors.firstName ? 'error' : undefined}
                errorMessage={errors.firstName?.message}
                {...register('firstName')}
              />
              <InputField
                label={t.form.lastName}
                placeholder={t.form.lastNamePlaceholder}
                variant={errors.lastName ? 'error' : undefined}
                errorMessage={errors.lastName?.message}
                {...register('lastName')}
              />
              <InputField
                label={t.form.phone}
                placeholder={t.form.phonePlaceholder}
                variant={errors.phone ? 'error' : undefined}
                errorMessage={errors.phone?.message}
                {...register('phone')}
              />
              <InputField
                label={t.form.dateOfBirth}
                placeholder={t.form.dateOfBirthPlaceholder}
                variant={errors.dateOfBirth ? 'error' : undefined}
                errorMessage={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
              <Select
                label={t.form.gender}
                options={Object.entries(genderLabel).map(([v, l]) => ({ value: v, label: l }))}
                value={genderValue ?? ''}
                onChange={(e) => setValue('gender', e.target.value as UpdateUserFormData['gender'])}
                placeholder={t.form.genderPlaceholder}
              />
              {groupOptions.length > 0 ? (
                <Select
                  label={t.form.groupId}
                  options={groupOptions}
                  value={groupValue ?? ''}
                  onChange={(e) => setValue('groupId', e.target.value)}
                  placeholder={t.form.groupIdPlaceholder}
                />
              ) : (
                <div />
              )}
            </div>

            <p className="text-sm font-medium text-slate-600">{t.form.addressSection}</p>
            <InputField
              label={t.form.addressStreet}
              placeholder={t.form.addressStreetPlaceholder}
              {...register('address.street')}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.addressCity}
                placeholder={t.form.addressCityPlaceholder}
                {...register('address.city')}
              />
              <InputField
                label={t.form.addressState}
                placeholder={t.form.addressStatePlaceholder}
                {...register('address.state')}
              />
              <InputField
                label={t.form.addressCountry}
                placeholder={t.form.addressCountryPlaceholder}
                {...register('address.country')}
              />
              <InputField
                label={t.form.addressPostalCode}
                placeholder={t.form.addressPostalCodePlaceholder}
                {...register('address.postalCode')}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                type="button"
                disabled={busy}
                onClick={() => {
                  reset()
                  onCancel()
                }}
              >
                {t.form.cancelButton}
              </Button>
              <Button variant="primary" type="submit" loading={busy}>
                {t.form.saveButton}
              </Button>
            </div>
          </>
        }
      />
    </form>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export const UserForm = ({
  mode,
  defaultValues,
  isSubmitting,
  onCancel,
  onCreate,
  onUpdate,
}: UserFormProps) => {
  if (mode === 'create') {
    return <CreateForm isSubmitting={isSubmitting} onCancel={onCancel} onCreate={onCreate} />
  }
  return (
    <EditForm
      defaultValues={defaultValues ?? {}}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      onUpdate={onUpdate}
    />
  )
}
