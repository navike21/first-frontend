import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { tabForErrors, type UserFormTab } from './userFormTabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useUsersTranslation } from '../../i18n'
import { createUpdateUserFormSchema } from '../../model/user.schema'
import type {
  UpdateUserFormData,
  UpdateUserFormValues,
} from '../../model/user.schema'
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
    () => createUpdateUserFormSchema(t.validation),
    [t.validation]
  )
  const { pendingFile, setPendingFile } = usePhotoUpload()
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [activeTab, setActiveTab] = useState<UserFormTab>('personal')

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
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(schema) as Resolver<UpdateUserFormValues>,
    defaultValues: {
      firstName: defaultValues.firstName ?? '',
      lastName: defaultValues.lastName ?? '',
      phone: defaultValues.phone ?? '',
      gender: defaultValues.gender,
      // The API returns dateOfBirth as a full ISO datetime; the form (and its
      // schema regex) expects YYYY-MM-DD, so slice off the time part on load.
      dateOfBirth: defaultValues.dateOfBirth?.slice(0, 10) ?? '',
      groupIds: defaultValues.groupIds ?? [],
      address: defaultValues.address ?? {},
      status: defaultValues.status ?? 'active',
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

  const onSubmit = handleSubmit(
    (data) => {
      // `confirmPassword` is UI-only; an empty `password` means "keep current" →
      // omit it so the backend (which validates min length) doesn't reject it.
      const { confirmPassword: _confirm, password, ...rest } = data
      const payload = (
        password ? { ...rest, password } : rest
      ) as UpdateUserFormData
      onUpdate(payload, pendingFile, removeAvatar)
    },
    // On invalid submit, reveal the tab that holds the first error.
    (formErrors) => setActiveTab(tabForErrors(formErrors))
  )

  const handleCancel = () => {
    reset()
    onCancel()
  }

  const onGenderChange = (v: string) =>
    setValue('gender', v as UpdateUserFormValues['gender'])
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
    activeTab,
    setActiveTab,
  }
}
