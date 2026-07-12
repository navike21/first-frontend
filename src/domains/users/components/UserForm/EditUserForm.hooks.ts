import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import type { WizardStep } from '@/shared/ui'
import {
  tabForErrors,
  USER_FORM_PERSONAL_FIELDS,
  type UserFormTab,
} from './userFormTabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useConfigData } from '@/shared/api/config'
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
    removeAvatar?: boolean,
    avatarLibraryUrl?: string
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
  const { t, language } = useUsersTranslation()
  const { userGroups, load } = useUserConfigStore()
  const { data: config } = useConfigData(['genders'], language)
  const schema = useMemo(
    () => createUpdateUserFormSchema(t.validation),
    [t.validation]
  )
  const { pendingFile, libraryUrl, setLibraryUrl, onPickFile, onSelectLibrary } = usePhotoUpload()
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [activeTab, setActiveTab] = useState<UserFormTab>('personal')

  // Picking a new photo (upload or library) cancels a pending removal; the
  // remove button clears any pending file/library pick and flags the avatar
  // for deletion on submit.
  const onPhotoChange = (file: File | null) => {
    onPickFile(file)
    if (file) setRemoveAvatar(false)
  }
  const onPhotoSelectLibrary: typeof onSelectLibrary = (file) => {
    onSelectLibrary(file)
    setRemoveAvatar(false)
  }
  const onRemovePhoto = () => {
    onPickFile(null)
    setLibraryUrl(null)
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
    trigger,
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
      address: {
        country: defaultValues.address?.country ?? '',
        ubigeoCode: defaultValues.address?.ubigeoCode ?? '',
        region: defaultValues.address?.region ?? '',
        province: defaultValues.address?.province ?? '',
        district: defaultValues.address?.district ?? '',
        address: defaultValues.address?.address ?? '',
        addressNumber: defaultValues.address?.addressNumber ?? '',
        addressInterior: defaultValues.address?.addressInterior ?? '',
      },
      status: defaultValues.status ?? 'active',
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const genderValue = useWatch({ control, name: 'gender' })
  const groupIdsValue = useWatch({ control, name: 'groupIds' })
  const statusValue = useWatch({ control, name: 'status' })
  const addressCountry = useWatch({ control, name: 'address.country' })
  const addressUbigeoCode = useWatch({ control, name: 'address.ubigeoCode' })
  const addressRegion = useWatch({ control, name: 'address.region' })
  const addressProvince = useWatch({ control, name: 'address.province' })
  const addressDistrict = useWatch({ control, name: 'address.district' })
  const busy = isSubmitting

  const genderOptions = config?.genders ?? []

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
      onUpdate(payload, pendingFile, removeAvatar, libraryUrl ?? undefined)
    },
    // On invalid submit, reveal the tab that holds the first error.
    (formErrors) => setActiveTab(tabForErrors(formErrors))
  )

  const handleCancel = () => {
    reset()
    onCancel()
  }

  // On edit the password can be left blank ("keep current"), so the account
  // step is optional.
  const errorKeys = Object.keys(errors)
  const personalFields = USER_FORM_PERSONAL_FIELDS as readonly string[]
  const steps: WizardStep[] = [
    {
      id: 'personal',
      label: t.form.tabPersonal,
      error: errorKeys.some((k) => personalFields.includes(k)),
    },
    {
      id: 'account',
      label: t.form.tabAccount,
      optional: true,
      error: errorKeys.some((k) => !personalFields.includes(k)),
    },
  ]
  // Editing an existing user: all steps are already filled, so every step is
  // freely reachable.
  const reachedIndex = steps.length - 1
  const goToStep = (id: string) => setActiveTab(id as UserFormTab)
  const handleNext = async () => {
    const ok = await trigger(
      USER_FORM_PERSONAL_FIELDS as unknown as (keyof UpdateUserFormValues)[]
    )
    if (ok) setActiveTab('account')
  }
  const handleBack = () => setActiveTab('personal')

  const onGenderChange = (v: string) =>
    setValue('gender', v as UpdateUserFormValues['gender'])
  const onGroupsChange = (v: string[]) => setValue('groupIds', v)
  const onStatusToggle = () =>
    setValue('status', statusValue === 'active' ? 'inactive' : 'active')
  const onAddressChange = (v: {
    countryCode?: string
    ubigeoCode?: string
    region?: string
    province?: string
    district?: string
  }) => {
    setValue('address.country', v.countryCode ?? '')
    setValue('address.ubigeoCode', v.ubigeoCode)
    setValue('address.region', v.region)
    setValue('address.province', v.province)
    setValue('address.district', v.district)
  }

  return {
    t,
    language,
    register,
    errors,
    genderValue,
    groupIdsValue,
    statusValue,
    addressCountry,
    addressUbigeoCode,
    addressRegion,
    addressProvince,
    addressDistrict,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    onPhotoChange,
    onPhotoSelectLibrary,
    onRemovePhoto,
    libraryUrl,
    onGenderChange,
    onGroupsChange,
    onStatusToggle,
    onAddressChange,
    activeTab,
    steps,
    reachedIndex,
    goToStep,
    handleNext,
    handleBack,
  }
}
