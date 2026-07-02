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
  const [activeTab, setActiveTab] = useState<UserFormTab>('personal')
  const [maxStep, setMaxStep] = useState(0)

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

  const onSubmit = handleSubmit(
    (data) => {
      // `confirmPassword` is UI-only; an empty `password` means "invite" (create
      // the user without a password) → omit it so the backend stores none.
      const { confirmPassword: _confirm, password, ...rest } = data
      const payload = (
        password ? { ...rest, password } : rest
      ) as CreateUserFormData
      onCreate(payload, pendingFile)
    },
    // On invalid submit, reveal the tab that holds the first error.
    (formErrors) => setActiveTab(tabForErrors(formErrors))
  )

  const handleCancel = () => {
    reset()
    onCancel()
  }

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
      // Optional: leaving password empty creates a passwordless user (invite).
      optional: true,
      error: errorKeys.some((k) => !personalFields.includes(k)),
    },
  ]
  const reachedIndex = maxStep
  const goToStep = (id: string) => setActiveTab(id as UserFormTab)
  const handleNext = async () => {
    const ok = await trigger(
      USER_FORM_PERSONAL_FIELDS as unknown as (keyof CreateUserFormValues)[]
    )
    if (!ok) return
    setActiveTab('account')
    setMaxStep((m) => Math.max(m, 1))
  }
  const handleBack = () => setActiveTab('personal')

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
    activeTab,
    setActiveTab,
    steps,
    reachedIndex,
    goToStep,
    handleNext,
    handleBack,
  }
}
