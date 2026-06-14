import type {
  CreateUserGroupFormData,
  UpdateUserGroupFormData,
} from '../../model/userGroup.schema'
import type { UserGroup } from '../../model/userGroup.types'
import { CreateUserGroupForm } from './CreateUserGroupForm'
import { EditUserGroupForm } from './EditUserGroupForm'

interface UserGroupFormProps {
  mode: 'create' | 'edit'
  defaultValues?: UserGroup
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserGroupFormData) => void
  onUpdate: (data: UpdateUserGroupFormData) => void
  submitError?: unknown
}

export const UserGroupForm = ({
  mode,
  defaultValues,
  isSubmitting,
  onCancel,
  onCreate,
  onUpdate,
  submitError,
}: UserGroupFormProps) => {
  if (mode === 'create') {
    return (
      <CreateUserGroupForm
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onCreate={onCreate}
        submitError={submitError}
      />
    )
  }

  if (!defaultValues) return null

  return (
    <EditUserGroupForm
      defaultValues={defaultValues}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      onUpdate={onUpdate}
      submitError={submitError}
    />
  )
}
