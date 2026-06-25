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
  onCreate: (data: CreateUserFormData, avatar?: File | null) => void
  onUpdate: (
    data: UpdateUserFormData,
    avatar?: File | null,
    removeAvatar?: boolean
  ) => void
  submitError?: unknown
  isProfile?: boolean
}

export const UserForm = ({
  mode,
  defaultValues,
  isSubmitting,
  onCancel,
  onCreate,
  onUpdate,
  submitError,
  isProfile,
}: UserFormProps) => {
  if (mode === 'create') {
    return (
      <CreateUserForm
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onCreate={onCreate}
        submitError={submitError}
      />
    )
  }
  return (
    <EditUserForm
      defaultValues={defaultValues ?? {}}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      onUpdate={onUpdate}
      submitError={submitError}
      isProfile={isProfile}
    />
  )
}
