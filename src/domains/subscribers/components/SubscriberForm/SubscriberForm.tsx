import { useEffect, useMemo, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  Select,
  TextArea,
  Wizard,
  type WizardStep,
} from '@/shared/ui'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useSubscribersTranslation } from '../../i18n'
import { createSubscriberSchema } from '../../model/subscriber.schema'
import type { SubscriberFormData } from '../../model/subscriber.schema'

export interface SubscriberFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<SubscriberFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: SubscriberFormData) => void
}

type SubscriberFormTab = 'personal' | 'contact' | 'optional'

const TAB_FIELDS: Record<SubscriberFormTab, string[]> = {
  personal: ['firstName', 'lastName', 'personalInformation'],
  contact: ['contactInformation'],
  optional: ['status'],
}

export const SubscriberForm = ({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: SubscriberFormProps) => {
  const { t, language } = useSubscribersTranslation()
  const schema = useMemo(() => createSubscriberSchema(t.validation), [t.validation])

  const [activeTab, setActiveTab] = useState<SubscriberFormTab>('personal')
  const [maxStep, setMaxStep] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    trigger,
    watch,
    formState: { errors },
  } = useForm<SubscriberFormData>({
    resolver: zodResolver(schema) as Resolver<SubscriberFormData>,
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      contactInformation: { email: '', phoneNumber: '', address: '' },
      personalInformation: {
        gender: 'prefer_not_to_say',
        dateOfBirth: '',
        profilePictureUrl: '',
      },
      status: 'active',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const genderValue = watch('personalInformation.gender')
  const statusValue = watch('status')

  const genderOptions = [
    { value: 'male', label: t.genders.male },
    { value: 'female', label: t.genders.female },
    { value: 'other', label: t.genders.other },
    { value: 'prefer_not_to_say', label: t.genders.prefer_not_to_say },
  ]

  const statusOptions = [
    { value: 'active', label: t.status.active },
    { value: 'inactive', label: t.status.inactive },
  ]

  const req = (label: string) => (
    <>
      {label} <span className="text-red-500">*</span>
    </>
  )

  const steps: WizardStep[] = [
    {
      id: 'personal',
      label: t.form.sectionPersonal,
      error: Object.keys(errors).some((k) =>
        TAB_FIELDS.personal.some((f) => k === f || k.startsWith(f))
      ),
    },
    {
      id: 'contact',
      label: t.form.sectionContact,
      error: Object.keys(errors).some((k) =>
        TAB_FIELDS.contact.some((f) => k === f || k.startsWith(f))
      ),
    },
    {
      id: 'optional',
      label: t.form.sectionOptional,
      optional: true,
    },
  ]

  const reachedIndex = mode === 'edit' ? steps.length - 1 : maxStep

  const handleNext = async () => {
    const fields = TAB_FIELDS[activeTab] as (keyof SubscriberFormData)[]
    const ok = await trigger(fields)
    if (!ok) return
    const i = steps.findIndex((s) => s.id === activeTab)
    if (i < steps.length - 1) {
      const nextIndex = i + 1
      setActiveTab(steps[nextIndex].id as SubscriberFormTab)
      setMaxStep((m) => Math.max(m, nextIndex))
    }
  }

  const handleBack = () => {
    const i = steps.findIndex((s) => s.id === activeTab)
    if (i > 0) setActiveTab(steps[i - 1].id as SubscriberFormTab)
  }

  const submit = handleSubmit(
    (data) => onSubmit(data),
    (formErrors) => {
      const keys = Object.keys(formErrors)
      const tabs: SubscriberFormTab[] = ['personal', 'contact', 'optional']
      for (const tab of tabs) {
        if (TAB_FIELDS[tab].some((f) => keys.some((k) => k === f || k.startsWith(f)))) {
          setActiveTab(tab)
          break
        }
      }
    }
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="rounded-xl border border-border bg-surface p-6">
        <Wizard
          steps={steps}
          current={activeTab}
          reachedIndex={reachedIndex}
          onStepChange={(id) => setActiveTab(id as SubscriberFormTab)}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={submit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          backLabel={t.form.back}
          nextLabel={t.form.next}
          submitLabel={mode === 'create' ? t.form.create : t.form.save}
          cancelLabel={t.form.cancel}
          optionalLabel={t.form.optional}
        >
          {/* Step 1 — Personal */}
          <div
            hidden={activeTab !== 'personal'}
            className="animate-tab-fade grid grid-cols-1 gap-6 xl:grid-cols-2"
          >
            <InputField
              label={req(t.form.firstName)}
              variant={errors.firstName ? 'error' : undefined}
              errorMessage={errors.firstName?.message}
              {...register('firstName')}
            />
            <InputField
              label={req(t.form.lastName)}
              variant={errors.lastName ? 'error' : undefined}
              errorMessage={errors.lastName?.message}
              {...register('lastName')}
            />
            <Select
              label={req(t.form.gender)}
              options={genderOptions}
              value={genderValue}
              lang={language}
              onChange={(e) =>
                setValue(
                  'personalInformation.gender',
                  e.target.value as SubscriberFormData['personalInformation']['gender']
                )
              }
            />
          </div>

          {/* Step 2 — Contact */}
          <div
            hidden={activeTab !== 'contact'}
            className="animate-tab-fade grid grid-cols-1 gap-6 xl:grid-cols-2"
          >
            <InputField
              label={req(t.form.email)}
              type="email"
              variant={errors.contactInformation?.email ? 'error' : undefined}
              errorMessage={errors.contactInformation?.email?.message}
              {...register('contactInformation.email')}
            />
            <InputField
              label={t.form.phoneNumber}
              variant={errors.contactInformation?.phoneNumber ? 'error' : undefined}
              errorMessage={errors.contactInformation?.phoneNumber?.message}
              {...register('contactInformation.phoneNumber')}
            />
            <div className="xl:col-span-2">
              <TextArea
                label={t.form.address}
                rows={3}
                variant={
                  errors.contactInformation?.address ? 'error' : 'default'
                }
                errorMessage={errors.contactInformation?.address?.message}
                {...register('contactInformation.address')}
              />
            </div>
          </div>

          {/* Step 3 — Optional */}
          <div
            hidden={activeTab !== 'optional'}
            className="animate-tab-fade grid grid-cols-1 gap-6 xl:grid-cols-2"
          >
            <InputField
              label={t.form.dateOfBirth}
              {...register('personalInformation.dateOfBirth')}
            />
            <InputField
              label={t.form.profilePictureUrl}
              variant={
                errors.personalInformation?.profilePictureUrl ? 'error' : undefined
              }
              errorMessage={errors.personalInformation?.profilePictureUrl?.message}
              {...register('personalInformation.profilePictureUrl')}
            />
            <Select
              label={t.form.status}
              options={statusOptions}
              value={statusValue}
              lang={language}
              onChange={(e) =>
                setValue('status', e.target.value as 'active' | 'inactive')
              }
            />
          </div>
        </Wizard>
      </div>
    </form>
  )
}
