import { useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useUserGroupsTranslation } from '../../i18n'
import { createCreateUserGroupSchema } from '../../model/userGroup.schema'
import type { CreateUserGroupFormData } from '../../model/userGroup.schema'
import { usePermissionsCatalog } from '../../api/userGroups.queries'

export interface UseCreateUserGroupFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserGroupFormData) => void
  /** Backend error from the submit mutation — mapped to inline field errors. */
  submitError?: unknown
}

export function useCreateUserGroupForm({
  isSubmitting,
  onCancel,
  onCreate,
  submitError,
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
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserGroupFormData>({
    // zod `.default()` makes the schema's input type looser than its output;
    // cast the resolver to the (output) form-data type used by useForm.
    resolver: zodResolver(schema) as Resolver<CreateUserGroupFormData>,
    defaultValues: {
      color: '#6366f1',
      permissions: [],
      status: 'active',
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

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
