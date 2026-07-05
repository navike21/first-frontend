import { useState, useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputDate,
  Select,
  TextArea,
  PhotoPicker,
  Button,
  FormGrid,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useSubscribersTranslation } from '../../i18n'
import { createSubscriberSchema } from '../../model/subscriber.schema'
import type { SubscriberFormData } from '../../model/subscriber.schema'

export interface SubscriberFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<SubscriberFormData>
  currentPhotoUrl?: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: SubscriberFormData, photo?: File | null, removePhoto?: boolean) => void
}

export const SubscriberForm = ({
  mode,
  initialValues,
  currentPhotoUrl,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: SubscriberFormProps) => {
  const { t, language } = useSubscribersTranslation()
  const schema = useMemo(() => createSubscriberSchema(t.validation), [t.validation])

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<SubscriberFormData>({
    resolver: zodResolver(schema) as Resolver<SubscriberFormData>,
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      contactInformation: { email: '', phoneNumber: '', address: '' },
      personalInformation: {
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

  const genderValue = useWatch({ control, name: 'personalInformation.gender' })
  const dateOfBirthValue = useWatch({ control, name: 'personalInformation.dateOfBirth' })

  const genderOptions = [
    { value: 'male', label: t.genders.male },
    { value: 'female', label: t.genders.female },
    { value: 'other', label: t.genders.other },
    { value: 'prefer_not_to_say', label: t.genders.prefer_not_to_say },
  ]

  const currentDisplayUrl = removePhoto || pendingFile ? undefined : currentPhotoUrl

  const handlePhotoChange = (file: File | null) => {
    setPendingFile(file)
    setRemovePhoto(false)
  }

  const handleRemovePhoto = () => {
    setPendingFile(null)
    setRemovePhoto(true)
  }

  const submit = handleSubmit((data) => onSubmit(data, pendingFile, removePhoto))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-6">

        {/* Photo picker — top, centered */}
        <div className="flex justify-center">
          <PhotoPicker
            currentUrl={currentDisplayUrl}
            uploadLabel={t.form.uploadPhoto}
            formatsHint={t.form.uploadFormats}
            onChange={handlePhotoChange}
            onRemove={currentPhotoUrl || pendingFile ? handleRemovePhoto : undefined}
            removeLabel={t.form.removePhoto}
            disabled={isSubmitting}
          />
        </div>

        {/* All fields */}
        <FormGrid>
          <InputField
            label={requiredLabel(t.form.firstName)}
            variant={errors.firstName ? 'error' : undefined}
            errorMessage={errors.firstName?.message}
            {...register('firstName')}
          />
          <InputField
            label={requiredLabel(t.form.lastName)}
            variant={errors.lastName ? 'error' : undefined}
            errorMessage={errors.lastName?.message}
            {...register('lastName')}
          />
          <Select
            label={requiredLabel(t.form.gender)}
            options={genderOptions}
            value={genderValue ?? ''}
            lang={language}
            placeholder={t.form.select}
            onChange={(e) =>
              setValue(
                'personalInformation.gender',
                e.target.value as SubscriberFormData['personalInformation']['gender']
              )
            }
          />
          <InputDate
            label={t.form.dateOfBirth}
            mode="date"
            lang={language}
            value={dateOfBirthValue ?? ''}
            variant={errors.personalInformation?.dateOfBirth ? 'error' : 'default'}
            errorMessage={errors.personalInformation?.dateOfBirth?.message}
            {...register('personalInformation.dateOfBirth')}
          />
          <InputField
            label={requiredLabel(t.form.email)}
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
              variant={errors.contactInformation?.address ? 'error' : 'default'}
              errorMessage={errors.contactInformation?.address?.message}
              {...register('contactInformation.address')}
            />
          </div>
        </FormGrid>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t.form.cancel}
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={isSubmitting}
            onClick={() => { void submit() }}
          >
            {mode === 'create' ? t.form.create : t.form.save}
          </Button>
        </div>
      </div>
    </form>
  )
}
