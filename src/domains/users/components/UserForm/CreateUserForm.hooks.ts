import { useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useUsersTranslation } from '../../i18n'
import { createCreateUserFormSchema } from '../../model/user.schema'
import type {
  CreateUserFormData,
  CreateUserFormValues,
} from '../../model/user.schema'
import { useUserConfigStore } from '../../model/userConfig.store'
import { usePhotoUpload } from './usePhotoUpload'

export interface UseCreateUserFormProps {
  isSubmitting: boolean
  onCancel: () => void
  onCreate: (data: CreateUserFormData, avatar?: File | null) => void
  /** Backend error from the submit mutation — mapped to inline field errors. */
  submitError?: unknown
}

export function useCreateUserForm({
  isSubmitting,
  onCancel,
  onCreate,
  submitError,
}: UseCreateUserFormProps) {
  const { t } = useUsersTranslation()
  const { userGroups, load } = useUserConfigStore()
  const schema = useMemo(
    () => createCreateUserFormSchema(t.validation),
    [t.validation]
  )
  const { pendingFile, setPendingFile } = usePhotoUpload()

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    // zod `.default()` makes the schema's input type looser than its output;
    // cast the resolver to the (output) form-values type used by useForm.
    resolver: zodResolver(schema) as Resolver<CreateUserFormValues>,
    defaultValues: { status: 'active' },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const genderValue = useWatch({ control, name: 'gender' })
  const groupIdsValue = useWatch({ control, name: 'groupIds' })
  const busy = isSubmitting

  const genderOptions = [
    { value: 'female', label: t.form.genderFemale },
    { value: 'male', label: t.form.genderMale },
    { value: 'other', label: t.form.genderOther },
    { value: 'prefer_not_to_say', label: t.form.genderPreferNotToSay },
  ]

  const groupOptions = userGroups
    .filter((g) => g.status === 'active')
    .map((g) => ({ value: g.id, label: g.name }))

  const onSubmit = handleSubmit((data) => {
    // `confirmPassword` is UI-only — never send it to the API.
    const { confirmPassword: _confirm, ...payload } = data
    onCreate(payload as CreateUserFormData, pendingFile)
  })

  const handleCancel = () => {
    reset()
    onCancel()
  }

  const onGenderChange = (v: string) =>
    setValue('gender', v as CreateUserFormData['gender'])
  const onGroupsChange = (v: string[]) => setValue('groupIds', v)

  return {
    t,
    register,
    errors,
    genderValue,
    groupIdsValue,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    setPendingFile,
    onGenderChange,
    onGroupsChange,
  }
}
