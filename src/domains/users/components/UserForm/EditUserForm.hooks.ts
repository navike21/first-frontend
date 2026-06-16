import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useUsersTranslation } from '../../i18n'
import { createUpdateUserSchema } from '../../model/user.schema'
import type { UpdateUserFormData } from '../../model/user.schema'
import type { User } from '../../model/user.types'
import { useUserConfigStore } from '../../model/userConfig.store'
import { usePhotoUpload } from './usePhotoUpload'

export interface UseEditUserFormProps {
  defaultValues: Partial<User>
  isSubmitting: boolean
  onCancel: () => void
  onUpdate: (
    data: UpdateUserFormData,
    avatar?: File | null,
    removeAvatar?: boolean
  ) => void
  /** Backend error from the submit mutation — mapped to inline field errors. */
  submitError?: unknown
}

export function useEditUserForm({
  defaultValues,
  isSubmitting,
  onCancel,
  onUpdate,
  submitError,
}: UseEditUserFormProps) {
  const { t } = useUsersTranslation()
  const { userGroups, load } = useUserConfigStore()
  const schema = useMemo(
    () => createUpdateUserSchema(t.validation),
    [t.validation]
  )
  const { pendingFile, setPendingFile } = usePhotoUpload()
  const [removeAvatar, setRemoveAvatar] = useState(false)

  // Picking a new photo cancels a pending removal; the remove button clears any
  // pending file and flags the avatar for deletion on submit.
  const onPhotoChange = (file: File | null) => {
    setPendingFile(file)
    if (file) setRemoveAvatar(false)
  }
  const onRemovePhoto = () => {
    setPendingFile(null)
    setRemoveAvatar(true)
  }

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
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: defaultValues.firstName ?? '',
      lastName: defaultValues.lastName ?? '',
      phone: defaultValues.phone ?? '',
      dateOfBirth: defaultValues.dateOfBirth ?? '',
      gender: defaultValues.gender,
      groupIds: defaultValues.groupIds ?? [],
      address: defaultValues.address ?? {},
      status:
        defaultValues.status === 'deleted'
          ? 'inactive'
          : (defaultValues.status ?? 'active'),
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const genderValue = useWatch({ control, name: 'gender' })
  const groupIdsValue = useWatch({ control, name: 'groupIds' })
  const statusValue = useWatch({ control, name: 'status' })
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
    onUpdate(data, pendingFile, removeAvatar)
  })

  const handleCancel = () => {
    reset()
    onCancel()
  }

  const onGenderChange = (v: string) =>
    setValue('gender', v as UpdateUserFormData['gender'])
  const onGroupsChange = (v: string[]) => setValue('groupIds', v)
  const onStatusToggle = () =>
    setValue('status', statusValue === 'active' ? 'inactive' : 'active')

  return {
    t,
    register,
    errors,
    genderValue,
    groupIdsValue,
    statusValue,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    onPhotoChange,
    onRemovePhoto,
    onGenderChange,
    onGroupsChange,
    onStatusToggle,
  }
}
