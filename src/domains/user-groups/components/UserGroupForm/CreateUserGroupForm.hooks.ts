import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserGroupsTranslation } from '../../i18n'
import { createCreateUserGroupSchema } from '../../model/userGroup.schema'
import type { CreateUserGroupFormData } from '../../model/userGroup.schema'
import { usePermissionsCatalog } from '../../api/userGroups.queries'

export interface UseCreateUserGroupFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserGroupFormData) => void
}

export function useCreateUserGroupForm({
  isSubmitting,
  onCancel,
  onCreate,
}: UseCreateUserGroupFormProps) {
  const { t } = useUserGroupsTranslation()
  const schema = useMemo(
    () => createCreateUserGroupSchema(t.validation),
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
  } = useForm<CreateUserGroupFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: '#6366f1',
      permissions: [],
      status: 'active',
    },
  })

  const permissionsValue = useWatch({ control, name: 'permissions' }) ?? []
  const colorValue = useWatch({ control, name: 'color' }) ?? '#6366f1'
  const busy = isSubmitting

  const setPermissionsValue = (v: string[]) => setValue('permissions', v)
  const setColor = (v: string) => setValue('color', v)

  const onSubmit = handleSubmit((data) => {
    onCreate(data)
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
    permissionsValue,
    setPermissionsValue,
    colorValue,
    setColor,
    catalog,
    onSubmit,
    handleCancel,
  }
}
