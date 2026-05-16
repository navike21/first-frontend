import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputField, Select } from '@/shared/ui'
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

const genderOptions = [
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
  { value: 'other', label: 'Otro' },
  { value: 'prefer_not_to_say', label: 'Prefiero no decir' },
]

const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
]

// ─── Create ──────────────────────────────────────────────────────────────────

interface CreateFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserFormData) => void
}

const CreateForm = ({ isSubmitting, onCancel, onCreate }: CreateFormProps) => {
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

  return (
    <form
      onSubmit={handleSubmit((data) => onCreate(data))}
      className="flex flex-col gap-4"
    >
      <div className="flex gap-3">
        <InputField
          label="Nombre"
          placeholder="José"
          variant={errors.firstName ? 'error' : undefined}
          errorMessage={errors.firstName?.message}
          {...register('firstName')}
        />
        <InputField
          label="Apellido"
          placeholder="García"
          variant={errors.lastName ? 'error' : undefined}
          errorMessage={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <InputField
        label="Email"
        type="email"
        placeholder="usuario@navike21.com"
        variant={errors.email ? 'error' : undefined}
        errorMessage={errors.email?.message}
        {...register('email')}
      />
      <InputField
        label="Contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
        variant={errors.password ? 'error' : undefined}
        errorMessage={errors.password?.message}
        {...register('password')}
      />

      <InputField
        label="Teléfono"
        placeholder="+51 999 999 999"
        variant={errors.phone ? 'error' : undefined}
        errorMessage={errors.phone?.message}
        {...register('phone')}
      />

      <Select
        label="Género"
        options={genderOptions}
        value={genderValue ?? ''}
        onChange={(e) => setValue('gender', e.target.value as CreateUserFormData['gender'])}
        placeholder="Seleccionar"
      />

      <Select
        label="Estado"
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
          Cancelar
        </Button>
        <Button variant="primary" fullWidth type="submit" loading={isSubmitting}>
          Crear usuario
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
      status:
        defaultValues.status === 'deleted' ? 'inactive' : (defaultValues.status ?? 'active'),
      gender: defaultValues.gender,
    },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const statusValue = useWatch({ control, name: 'status' })

  return (
    <form
      onSubmit={handleSubmit((data) => onUpdate(data))}
      className="flex flex-col gap-4"
    >
      <div className="flex gap-3">
        <InputField
          label="Nombre"
          placeholder="José"
          variant={errors.firstName ? 'error' : undefined}
          errorMessage={errors.firstName?.message}
          {...register('firstName')}
        />
        <InputField
          label="Apellido"
          placeholder="García"
          variant={errors.lastName ? 'error' : undefined}
          errorMessage={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <InputField
        label="Teléfono"
        placeholder="+51 999 999 999"
        variant={errors.phone ? 'error' : undefined}
        errorMessage={errors.phone?.message}
        {...register('phone')}
      />

      <Select
        label="Género"
        options={genderOptions}
        value={genderValue ?? ''}
        onChange={(e) => setValue('gender', e.target.value as UpdateUserFormData['gender'])}
        placeholder="Seleccionar"
      />

      <Select
        label="Estado"
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
          Cancelar
        </Button>
        <Button variant="primary" fullWidth type="submit" loading={isSubmitting}>
          Guardar cambios
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
    return (
      <CreateForm
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onCreate={onCreate}
      />
    )
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
