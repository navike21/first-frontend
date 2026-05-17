import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputField, Select } from '@/shared/ui'
import { useUsersTranslation } from '../../i18n'
import { createUserSchema, updateUserSchema } from '../../model/user.schema'
import type { CreateUserFormData, UpdateUserFormData } from '../../model/user.schema'
import type { User } from '../../model/user.types'

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

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { status: 'active' },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const statusValue = useWatch({ control, name: 'status' })

  const genderOptions = [
    { value: 'female', label: t.form.genderFemale },
    { value: 'male', label: t.form.genderMale },
    { value: 'other', label: t.form.genderOther },
    { value: 'prefer_not_to_say', label: t.form.genderPreferNotToSay },
  ]

  const statusOptions = [
    { value: 'active', label: t.form.statusActive },
    { value: 'inactive', label: t.form.statusInactive },
  ]

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

      <Select
        label={t.form.gender}
        options={genderOptions}
        value={genderValue ?? ''}
        onChange={(e) => setValue('gender', e.target.value as CreateUserFormData['gender'])}
        placeholder={t.form.genderPlaceholder}
      />

      <Select
        label={t.form.statusLabel}
        options={statusOptions}
        value={statusValue ?? 'active'}
        onChange={(e) => setValue('status', e.target.value as 'active' | 'inactive')}
      />

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          fullWidth
          type="button"
          disabled={isSubmitting}
          onClick={() => { reset(); onCancel() }}
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

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: defaultValues.firstName ?? '',
      lastName: defaultValues.lastName ?? '',
      phone: defaultValues.phone ?? '',
      status: defaultValues.status === 'deleted' ? 'inactive' : (defaultValues.status ?? 'active'),
      gender: defaultValues.gender,
    },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const statusValue = useWatch({ control, name: 'status' })

  const genderOptions = [
    { value: 'female', label: t.form.genderFemale },
    { value: 'male', label: t.form.genderMale },
    { value: 'other', label: t.form.genderOther },
    { value: 'prefer_not_to_say', label: t.form.genderPreferNotToSay },
  ]

  const statusOptions = [
    { value: 'active', label: t.form.statusActive },
    { value: 'inactive', label: t.form.statusInactive },
  ]

  return (
    <form onSubmit={handleSubmit((data) => onUpdate(data))} className="flex flex-col gap-4">
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

      <Select
        label={t.form.gender}
        options={genderOptions}
        value={genderValue ?? ''}
        onChange={(e) => setValue('gender', e.target.value as UpdateUserFormData['gender'])}
        placeholder={t.form.genderPlaceholder}
      />

      <Select
        label={t.form.statusLabel}
        options={statusOptions}
        value={statusValue ?? 'active'}
        onChange={(e) => setValue('status', e.target.value as 'active' | 'inactive')}
      />

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          fullWidth
          type="button"
          disabled={isSubmitting}
          onClick={() => { reset(); onCancel() }}
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
