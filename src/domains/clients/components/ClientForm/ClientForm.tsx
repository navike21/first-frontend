import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputField, Select, PhotoPicker } from '@/shared/ui'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useClientsTranslation } from '../../i18n'
import { createClientSchema } from '../../model/client.schema'
import type { CreateClientFormData } from '../../model/client.schema'
import { DOCUMENT_TYPES } from '../../model/client.types'

export interface ClientFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<CreateClientFormData>
  initialLogoUrl?: string
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (
    data: CreateClientFormData,
    logo?: File | null,
    removeLogo?: boolean
  ) => void
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-4">
    <p className="text-xs font-semibold tracking-wide text-muted uppercase">
      {title}
    </p>
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
      {children}
    </div>
  </div>
)

export const ClientForm = ({
  mode,
  initialValues,
  initialLogoUrl,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: ClientFormProps) => {
  const { t, language } = useClientsTranslation()
  const schema = useMemo(() => createClientSchema(t.validation), [t.validation])
  const [pendingLogo, setPendingLogo] = useState<File | null>(null)
  const [removeLogo, setRemoveLogo] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(schema) as Resolver<CreateClientFormData>,
    defaultValues: {
      clientType: 'company',
      status: 'active',
      country: '',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const clientType = useWatch({ control, name: 'clientType' })
  const documentType = useWatch({ control, name: 'documentType' })
  const status = useWatch({ control, name: 'status' })

  const clientTypeOptions = [
    { value: 'company', label: t.clientType.company },
    { value: 'person', label: t.clientType.person },
  ]
  const documentTypeOptions = [
    { value: '', label: t.form.documentTypeNone },
    ...DOCUMENT_TYPES.map((d) => ({ value: d, label: d })),
  ]
  const statusOptions = [
    { value: 'active', label: t.status.active },
    { value: 'inactive', label: t.status.inactive },
  ]

  const submit = handleSubmit((data) => {
    // Drop an entirely-empty primary contact so the backend doesn't reject it.
    const contact = data.primaryContact
    const hasContact = !!(
      contact &&
      (contact.firstName || contact.lastName || contact.email)
    )
    const payload: CreateClientFormData = {
      ...data,
      ...(hasContact ? {} : { primaryContact: undefined }),
    }
    onSubmit(payload, pendingLogo, removeLogo)
  })

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <div className="flex justify-center">
        <PhotoPicker
          uploadLabel={t.form.uploadLogo}
          formatsHint={t.form.logoHint}
          onChange={(file) => {
            setPendingLogo(file)
            if (file) setRemoveLogo(false)
          }}
          disabled={isSubmitting}
          {...(initialLogoUrl ? { currentUrl: initialLogoUrl } : {})}
          onRemove={() => {
            setPendingLogo(null)
            setRemoveLogo(true)
          }}
        />
      </div>

      <Section title={t.form.sectionGeneral}>
        <InputField
          label={t.form.businessName}
          variant={errors.businessName ? 'error' : undefined}
          errorMessage={errors.businessName?.message}
          {...register('businessName')}
        />
        <Select
          label={t.form.clientType}
          options={clientTypeOptions}
          value={clientType ?? 'company'}
          lang={language}
          onChange={(e) =>
            setValue('clientType', e.target.value as 'person' | 'company')
          }
        />
        <Select
          label={t.form.documentType}
          options={documentTypeOptions}
          value={documentType ?? ''}
          lang={language}
          onChange={(e) =>
            setValue(
              'documentType',
              e.target.value as CreateClientFormData['documentType']
            )
          }
        />
        <InputField
          label={t.form.documentNumber}
          variant={errors.documentNumber ? 'error' : undefined}
          errorMessage={errors.documentNumber?.message}
          {...register('documentNumber')}
        />
        <InputField
          label={t.form.industry}
          {...register('industry')}
        />
        <Select
          label={t.form.status}
          options={statusOptions}
          value={status ?? 'active'}
          lang={language}
          onChange={(e) =>
            setValue('status', e.target.value as 'active' | 'inactive')
          }
        />
      </Section>

      <Section title={t.form.sectionLocation}>
        <InputField
          label={t.form.country}
          helperText={t.form.countryHint}
          variant={errors.country ? 'error' : undefined}
          errorMessage={errors.country?.message}
          {...register('country')}
        />
        <InputField label={t.form.state} {...register('state')} />
        <InputField label={t.form.city} {...register('city')} />
        <InputField label={t.form.postalCode} {...register('postalCode')} />
        <InputField label={t.form.address} {...register('address')} />
      </Section>

      <Section title={t.form.sectionOther}>
        <InputField
          label={t.form.website}
          variant={errors.website ? 'error' : undefined}
          errorMessage={errors.website?.message}
          {...register('website')}
        />
        <InputField
          label={t.form.email}
          variant={errors.email ? 'error' : undefined}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <InputField label={t.form.phone} {...register('phone')} />
        <InputField label={t.form.language} {...register('language')} />
        <InputField
          label={t.form.currency}
          helperText={t.form.currencyHint}
          variant={errors.currency ? 'error' : undefined}
          errorMessage={errors.currency?.message}
          {...register('currency')}
        />
      </Section>

      <Section title={t.form.sectionContact}>
        <InputField
          label={t.form.contactFirstName}
          variant={errors.primaryContact?.firstName ? 'error' : undefined}
          errorMessage={errors.primaryContact?.firstName?.message}
          {...register('primaryContact.firstName')}
        />
        <InputField
          label={t.form.contactLastName}
          variant={errors.primaryContact?.lastName ? 'error' : undefined}
          errorMessage={errors.primaryContact?.lastName?.message}
          {...register('primaryContact.lastName')}
        />
        <InputField
          label={t.form.contactEmail}
          variant={errors.primaryContact?.email ? 'error' : undefined}
          errorMessage={errors.primaryContact?.email?.message}
          {...register('primaryContact.email')}
        />
        <InputField
          label={t.form.contactPhone}
          {...register('primaryContact.phone')}
        />
        <InputField
          label={t.form.contactPosition}
          {...register('primaryContact.position')}
        />
      </Section>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">
          {t.form.notes}
        </p>
        <InputField label={t.form.notes} {...register('notes')} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t.form.cancel}
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {mode === 'create' ? t.form.create : t.form.save}
        </Button>
      </div>
    </form>
  )
}
