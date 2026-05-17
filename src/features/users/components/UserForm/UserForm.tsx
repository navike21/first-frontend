import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputField, Select } from '@/shared/ui'
import { useUsersTranslation } from '../../i18n'
import { createCreateUserSchema, createUpdateUserSchema } from '../../model/user.schema'
import type { CreateUserFormData, UpdateUserFormData } from '../../model/user.schema'
import type { User } from '../../model/user.types'
import { useUserConfigStore } from '../../model/userConfig.store'
import { AvatarUploader } from '@/features/storage/components/AvatarUploader/AvatarUploader'

type Mode = 'create' | 'edit'

interface UserFormProps {
  mode: Mode
  defaultValues?: Partial<User>
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserFormData) => void
  onUpdate: (data: UpdateUserFormData) => void
}

// ─── Create ──────────────────────────────────────────────────────────────────

interface CreateFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserFormData) => void
}

const CreateForm = ({ isSubmitting, onCancel, onCreate }: CreateFormProps) => {
  const { t } = useUsersTranslation()
  const { genders, userGroups, load } = useUserConfigStore()
  const schema = useMemo(() => createCreateUserSchema(t.validation), [t.validation])

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
    // status omitted — backend defaults to 'active'
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const groupValue = useWatch({ control, name: 'groupId' })

  const genderOptions = genders.map((g) => ({
    value: g,
    label:
      (t.form[
        `gender${g.charAt(0).toUpperCase()}${g.slice(1).replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())}` as keyof typeof t.form
      ] as string) ?? g,
  }))

  const genderLabel: Record<string, string> = {
    female: t.form.genderFemale,
    male: t.form.genderMale,
    other: t.form.genderOther,
    prefer_not_to_say: t.form.genderPreferNotToSay,
  }

  const groupOptions = userGroups
    .filter((g) => g.status === 'active')
    .map((g) => ({ value: g.id, label: g.name }))

  return (
    <form onSubmit={handleSubmit((data) => onCreate(data))} className="flex flex-col gap-4">
      <div className="flex gap-3">
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
      </div>

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
      <InputField
        label={t.form.profilePictureUrl}
        placeholder={t.form.profilePictureUrlPlaceholder}
        variant={errors.profilePictureUrl ? 'error' : undefined}
        errorMessage={errors.profilePictureUrl?.message}
        {...register('profilePictureUrl')}
      />

      <Select
        label={t.form.gender}
        options={Object.entries(genderLabel).map(([v, l]) => ({ value: v, label: l }))}
        value={genderValue ?? ''}
        onChange={(e) => setValue('gender', e.target.value as CreateUserFormData['gender'])}
        placeholder={t.form.genderPlaceholder}
      />

      {groupOptions.length > 0 && (
        <Select
          label={t.form.groupId}
          options={groupOptions}
          value={groupValue ?? ''}
          onChange={(e) => setValue('groupId', e.target.value)}
          placeholder={t.form.groupIdPlaceholder}
        />
      )}

      <p className="text-sm font-medium text-slate-700">{t.form.addressSection}</p>
      <InputField
        label={t.form.addressStreet}
        placeholder={t.form.addressStreetPlaceholder}
        {...register('address.street')}
      />
      <div className="flex gap-3">
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
      </div>
      <div className="flex gap-3">
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

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          fullWidth
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            reset()
            onCancel()
          }}
        >
          {t.form.cancelButton}
        </Button>
        <Button variant="primary" fullWidth type="submit" loading={isSubmitting}>
          {t.form.createButton}
        </Button>
      </div>
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
  const { genders, userStatuses, userGroups, load } = useUserConfigStore()
  const schema = useMemo(() => createUpdateUserSchema(t.validation), [t.validation])

  useEffect(() => {
    void load()
  }, [load])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      profilePictureUrl: defaultValues.profilePictureUrl ?? '',
      gender: defaultValues.gender,
      groupId: defaultValues.groupId ?? '',
      address: defaultValues.address ?? {},
      // 'deleted' is not a user-selectable status — map it to 'inactive'
      status: defaultValues.status === 'deleted' ? 'inactive' : (defaultValues.status ?? 'active'),
    },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const statusValue = useWatch({ control, name: 'status' })
  const groupValue = useWatch({ control, name: 'groupId' })
  const avatarUrl = watch('profilePictureUrl')

  const genderLabel: Record<string, string> = {
    female: t.form.genderFemale,
    male: t.form.genderMale,
    other: t.form.genderOther,
    prefer_not_to_say: t.form.genderPreferNotToSay,
  }

  const statusLabel: Record<string, string> = {
    active: t.form.statusActive,
    inactive: t.form.statusInactive,
  }

  const groupOptions = userGroups
    .filter((g) => g.status === 'active')
    .map((g) => ({ value: g.id, label: g.name }))

  return (
    <form onSubmit={handleSubmit((data) => onUpdate(data))} className="flex flex-col gap-4">
      {/* Avatar uploader — only in edit mode where we have the user ID */}
      {defaultValues.id && (
        <div className="flex justify-center py-2">
          <AvatarUploader
            entityId={defaultValues.id}
            currentUrl={avatarUrl ?? defaultValues.profilePictureUrl}
            name={`${defaultValues.firstName ?? ''} ${defaultValues.lastName ?? ''}`.trim()}
            onUpload={(url) => setValue('profilePictureUrl', url)}
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="flex gap-3">
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
      </div>

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
      <InputField
        label={t.form.profilePictureUrl}
        placeholder={t.form.profilePictureUrlPlaceholder}
        variant={errors.profilePictureUrl ? 'error' : undefined}
        errorMessage={errors.profilePictureUrl?.message}
        {...register('profilePictureUrl')}
      />

      <Select
        label={t.form.gender}
        options={Object.entries(genderLabel).map(([v, l]) => ({ value: v, label: l }))}
        value={genderValue ?? ''}
        onChange={(e) => setValue('gender', e.target.value as UpdateUserFormData['gender'])}
        placeholder={t.form.genderPlaceholder}
      />

      {groupOptions.length > 0 && (
        <Select
          label={t.form.groupId}
          options={groupOptions}
          value={groupValue ?? ''}
          onChange={(e) => setValue('groupId', e.target.value)}
          placeholder={t.form.groupIdPlaceholder}
        />
      )}

      <p className="text-sm font-medium text-slate-700">{t.form.addressSection}</p>
      <InputField
        label={t.form.addressStreet}
        placeholder={t.form.addressStreetPlaceholder}
        {...register('address.street')}
      />
      <div className="flex gap-3">
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
      </div>
      <div className="flex gap-3">
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

      <Select
        label={t.form.statusLabel}
        options={userStatuses.map((s) => ({ value: s, label: statusLabel[s] ?? s }))}
        value={statusValue ?? 'active'}
        onChange={(e) => setValue('status', e.target.value as 'active' | 'inactive')}
      />

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          fullWidth
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            reset()
            onCancel()
          }}
        >
          {t.form.cancelButton}
        </Button>
        <Button variant="primary" fullWidth type="submit" loading={isSubmitting}>
          {t.form.saveButton}
        </Button>
      </div>
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
