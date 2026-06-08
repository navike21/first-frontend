import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserGroupsTranslation } from '../../i18n'
import { createUpdateUserGroupSchema } from '../../model/userGroup.schema'
import type { UpdateUserGroupFormData } from '../../model/userGroup.schema'
import type { UserGroup } from '../../model/userGroup.types'
import { usePermissionsCatalog } from '../../api/userGroups.queries'

export interface UseEditUserGroupFormProps {
  defaultValues: UserGroup
  isSubmitting: boolean
  onCancel: () => void
  onUpdate: (data: UpdateUserGroupFormData) => void
}

export function useEditUserGroupForm({
  defaultValues,
  isSubmitting,
  onCancel,
  onUpdate,
}: UseEditUserGroupFormProps) {
  const { t } = useUserGroupsTranslation()
  const schema = useMemo(
    () => createUpdateUserGroupSchema(t.validation),
    [t.validation]
  )
  const { data: catalog = [] } = usePermissionsCatalog()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUserGroupFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description ?? '',
      color: defaultValues.color,
      permissions: defaultValues.permissions,
      status: defaultValues.status,
    },
  })

  const permissionsValue =
    useWatch({ control, name: 'permissions' }) ?? defaultValues.permissions
  const colorValue = useWatch({ control, name: 'color' }) ?? defaultValues.color
  const statusValue =
    useWatch({ control, name: 'status' }) ?? defaultValues.status
  const busy = isSubmitting
  const isSystem = defaultValues.isSystem

  const setPermissionsValue = (v: string[]) => setValue('permissions', v)
  const setColor = (v: string) => setValue('color', v)
  const onStatusToggle = () =>
    setValue('status', statusValue === 'active' ? 'inactive' : 'active')

  const onSubmit = handleSubmit((data) => {
    onUpdate(data)
  })

  const handleCancel = () => {
    reset()
    onCancel()
  }

  return {
    t,
    register,
    errors,
    busy,
    isSystem,
    permissionsValue,
    setPermissionsValue,
    colorValue,
    setColor,
    statusValue,
    onStatusToggle,
    catalog,
    onSubmit,
    handleCancel,
  }
}
