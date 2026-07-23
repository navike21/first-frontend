import { useState, useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputNumber,
  InputDate,
  Select,
  PhotoPicker,
  Button,
  ButtonGroup,
  FormGrid,
  LocationSelect,
  SectionLabel,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import type { StorageFile } from '@/shared/api/storage'
import { useSubscribersTranslation } from '../../i18n'
import { createSubscriberSchema } from '../../model/subscriber.schema'
import type { SubscriberFormData } from '../../model/subscriber.schema'
import type { LocationValue } from '@/shared/ui'

export interface SubscriberFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<SubscriberFormData>
  currentPhotoUrl?: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (
    data: SubscriberFormData,
    photo?: File | null,
    removePhoto?: boolean,
    photoLibraryUrl?: string
  ) => void
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
  const schema = useMemo(
    () => createSubscriberSchema(t.validation),
    [t.validation]
  )

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [photoLibraryUrl, setPhotoLibraryUrl] = useState<string | null>(null)

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
      contactInformation: { email: '', phoneNumber: '' },
      location: {
        countryCode: '',
        ubigeoCode: '',
        region: '',
        province: '',
        district: '',
        address: '',
        addressNumber: '',
        addressInterior: '',
      },
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
  const dateOfBirthValue = useWatch({
    control,
    name: 'personalInformation.dateOfBirth',
  })
  const locationValue = useWatch({ control, name: 'location' })

  const genderOptions = [
    { value: 'male', label: t.genders.male },
    { value: 'female', label: t.genders.female },
    { value: 'other', label: t.genders.other },
    { value: 'prefer_not_to_say', label: t.genders.prefer_not_to_say },
  ]

  const currentDisplayUrl =
    removePhoto || pendingFile
      ? undefined
      : (photoLibraryUrl ?? currentPhotoUrl)

  const handlePhotoChange = (file: File | null) => {
    setPendingFile(file)
    setRemovePhoto(false)
    setPhotoLibraryUrl(null)
  }

  const handleRemovePhoto = () => {
    setPendingFile(null)
    setRemovePhoto(true)
    setPhotoLibraryUrl(null)
  }

  const handleSelectPhotoLibrary = (file: StorageFile) => {
    setPhotoLibraryUrl(file.original.url)
    setPendingFile(null)
    setRemovePhoto(false)
  }

  const handleLocationChange = (v: LocationValue) => {
    setValue('location.countryCode', v.countryCode ?? '')
    setValue('location.ubigeoCode', v.ubigeoCode ?? '')
    setValue('location.region', v.region ?? '')
    setValue('location.province', v.province ?? '')
    setValue('location.district', v.district ?? '')
  }

  const submit = handleSubmit((data) =>
    onSubmit(data, pendingFile, removePhoto, photoLibraryUrl ?? undefined)
  )

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
        {/* Photo — top, centered */}
        <div className="flex justify-center">
          <PhotoPicker
            currentUrl={currentDisplayUrl}
            uploadLabel={t.form.uploadPhoto}
            formatsHint={t.form.uploadFormats}
            onChange={handlePhotoChange}
            onRemove={
              currentPhotoUrl || pendingFile ? handleRemovePhoto : undefined
            }
            removeLabel={t.form.removePhoto}
            onSelectLibrary={handleSelectPhotoLibrary}
            libraryTexts={t.mediaLibrary}
            disabled={isSubmitting}
          />
        </div>

        {/* Personal */}
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
                e.target
                  .value as SubscriberFormData['personalInformation']['gender']
              )
            }
          />
          <InputDate
            label={t.form.dateOfBirth}
            mode="date"
            lang={language}
            value={dateOfBirthValue ?? ''}
            variant={
              errors.personalInformation?.dateOfBirth ? 'error' : 'default'
            }
            errorMessage={errors.personalInformation?.dateOfBirth?.message}
            {...register('personalInformation.dateOfBirth')}
          />
        </FormGrid>

        {/* Contact */}
        <FormGrid>
          <InputField
            label={requiredLabel(t.form.email)}
            type="email"
            variant={errors.contactInformation?.email ? 'error' : undefined}
            errorMessage={errors.contactInformation?.email?.message}
            {...register('contactInformation.email')}
          />
          <InputNumber
            label={t.form.phoneNumber}
            mask="+## ### ### ###"
            variant={
              errors.contactInformation?.phoneNumber ? 'error' : undefined
            }
            errorMessage={errors.contactInformation?.phoneNumber?.message}
            {...register('contactInformation.phoneNumber')}
          />
        </FormGrid>

        {/* Location */}
        <div className="flex flex-col gap-3">
          <SectionLabel>{t.form.country}</SectionLabel>
          <FormGrid>
            <LocationSelect
              value={{
                countryCode: locationValue?.countryCode ?? '',
                ubigeoCode: locationValue?.ubigeoCode ?? '',
                region: locationValue?.region ?? '',
                province: locationValue?.province ?? '',
                district: locationValue?.district ?? '',
              }}
              onChange={handleLocationChange}
              countryLabel={t.form.country}
              regionLabel={t.form.region}
              cityLabel={t.form.province}
              lang={language}
              disabled={isSubmitting}
            />
            <InputField
              label={t.form.addressStreet}
              autoComplete="address-line1"
              variant={errors.location?.address ? 'error' : undefined}
              errorMessage={errors.location?.address?.message}
              {...register('location.address')}
            />
            <InputField
              label={t.form.addressNumber}
              autoComplete="off"
              {...register('location.addressNumber')}
            />
            <InputField
              label={t.form.addressInterior}
              // WHATWG's address-line2 is exactly "apartment, suite, unit,
              // building, floor" — without this hint, a browser's address
              // autofill profile (name+address+email bundled together) can
              // fill this with a saved EMAIL instead of an address line
              // (confirmed happening on the equivalent Users form field —
              // see CreateUserForm.tsx).
              autoComplete="address-line2"
              {...register('location.addressInterior')}
            />
          </FormGrid>
        </div>

        {/* Footer */}
        <ButtonGroup className="border-border border-t pt-4">
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
            onClick={() => {
              void submit()
            }}
          >
            {mode === 'create' ? t.form.create : t.form.save}
          </Button>
        </ButtonGroup>
      </div>
    </form>
  )
}
