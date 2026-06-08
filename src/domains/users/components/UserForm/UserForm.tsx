import type {
  CreateUserFormData,
  UpdateUserFormData,
} from '../../model/user.schema'
import type { User } from '../../model/user.types'
import { CreateUserForm } from './CreateUserForm'
import { EditUserForm } from './EditUserForm'

interface UserFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<User>
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserFormData) => void
  onUpdate: (data: UpdateUserFormData) => void
}

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
      <CreateUserForm
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onCreate={onCreate}
      />
    )
  }
  return (
    <EditUserForm
      defaultValues={defaultValues ?? {}}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      onUpdate={onUpdate}
    />
  )
}
