import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notify } from '@/shared/lib/notify'
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
  onUpdate: (data: UpdateUserFormData) => void
}

export function useEditUserForm({ defaultValues, isSubmitting, onCancel, onUpdate }: UseEditUserFormProps) {
  const { t } = useUsersTranslation()
  const { userGroups, load } = useUserConfigStore()
  const schema = useMemo(() => createUpdateUserSchema(t.validation), [t.validation])
  const { setPendingFile, isUploading, uploadIfNeeded } = usePhotoUpload()

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  const {
    register,
    handleSubmit,
    setValue,
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
      groupId: defaultValues.groupId ?? '',
      address: defaultValues.address ?? {},
      status: defaultValues.status === 'deleted' ? 'inactive' : (defaultValues.status ?? 'active'),
    },
  })

  const genderValue = useWatch({ control, name: 'gender' })
  const groupValue = useWatch({ control, name: 'groupId' })
  const statusValue = useWatch({ control, name: 'status' })
  const busy = isSubmitting || isUploading

  const genderOptions = [
    { value: 'female', label: t.form.genderFemale },
    { value: 'male', label: t.form.genderMale },
    { value: 'other', label: t.form.genderOther },
    { value: 'prefer_not_to_say', label: t.form.genderPreferNotToSay },
  ]

  const groupOptions = userGroups
    .filter((g) => g.status === 'active')
    .map((g) => ({ value: g.id, label: g.name }))

  const onSubmit = handleSubmit(async (data) => {
    let profilePictureUrl = defaultValues.profilePictureUrl ?? ''
    try {
      const entityId = defaultValues.id ?? crypto.randomUUID()
      const uploaded = await uploadIfNeeded(entityId)
      if (uploaded) profilePictureUrl = uploaded
    } catch (err) {
      notify.error(err instanceof Error ? err.message : 'Upload failed')
      return
    }
    onUpdate({ ...data, profilePictureUrl })
  })

  const handleCancel = () => {
    reset()
    onCancel()
  }

  const onGenderChange = (v: string) =>
    setValue('gender', v as UpdateUserFormData['gender'])
  const onGroupChange = (v: string) => setValue('groupId', v)
  const onStatusToggle = () =>
    setValue('status', statusValue === 'active' ? 'inactive' : 'active')

  return {
    t,
    register,
    errors,
    genderValue,
    groupValue,
    statusValue,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    setPendingFile,
    onGenderChange,
    onGroupChange,
    onStatusToggle,
  }
}
