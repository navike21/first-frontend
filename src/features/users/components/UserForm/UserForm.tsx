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

export const UserForm = ({
  mode,
  defaultValues,
  isSubmitting,
  onCancel,
  onCreate,
  onUpdate,
}: UserFormProps) => {
  const isCreate = mode === 'create'
  const schema = isCreate ? createUserSchema : updateUserSchema

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? '',
      lastName: defaultValues?.lastName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      status: defaultValues?.status === 'deleted' ? 'inactive' : (defaultValues?.status ?? 'active'),
      gender: defaultValues?.gender,
    },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const statusValue = useWatch({ control, name: 'status' })

  const handleCancel = () => {
    reset()
    onCancel()
  }

  const onSubmit = (data: CreateUserFormData) => {
    if (isCreate) {
      onCreate(data)
    } else {
      const { email: _email, password: _password, ...updateData } = data
      onUpdate(updateData)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <InputField
          label="Nombre"
          placeholder="José"
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          {...register('firstName')}
        />
        <InputField
          label="Apellido"
          placeholder="García"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      {isCreate && (
        <>
          <InputField
            label="Email"
            type="email"
            placeholder="usuario@navike21.com"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <InputField
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />
        </>
      )}

      <InputField
        label="Teléfono"
        placeholder="+51 999 999 999"
        error={!!errors.phone}
        helperText={errors.phone?.message}
        {...register('phone')}
      />

      <Select
        label="Género"
        options={genderOptions}
        value={genderValue ?? ''}
        onChange={(val) => setValue('gender', val as CreateUserFormData['gender'])}
        placeholder="Seleccionar"
      />

      <Select
        label="Estado"
        options={statusOptions}
        value={statusValue ?? 'active'}
        onChange={(val) => setValue('status', val as 'active' | 'inactive')}
      />

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={handleCancel} type="button" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button variant="primary" fullWidth type="submit" loading={isSubmitting}>
          {isCreate ? 'Crear usuario' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}
