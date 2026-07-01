import { useEffect, useMemo, useState } from 'react'
import {
  useForm,
  useWatch,
  type FieldErrors,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputNumber,
  Select,
  PhotoPicker,
  TextArea,
  Wizard,
  LocationSelect,
  type WizardStep,
} from '@/shared/ui'
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

type ClientFormTab = 'general' | 'location' | 'contact'

const TAB_FIELDS: Record<ClientFormTab, string[]> = {
  general: [
    'businessName',
    'clientType',
    'documentType',
    'documentNumber',
    'industry',
    'status',
  ],
  location: ['country', 'ubigeoCode', 'region', 'province', 'district', 'address'],
  contact: [
    'website',
    'email',
    'phone',
    'language',
    'currency',
    'primaryContact',
    'notes',
  ],
}

/** Returns the tab that holds the first invalid field (for tab switching). */
function tabForErrors(errors: FieldErrors<CreateClientFormData>): ClientFormTab {
  const keys = Object.keys(errors)
  const tabs: ClientFormTab[] = ['general', 'location', 'contact']
  for (const tab of tabs) {
    if (TAB_FIELDS[tab].some((f) => keys.includes(f))) return tab
  }
  return 'general'
}

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
    {children}
  </div>
)

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold tracking-wide text-muted uppercase">
    {children}
  </p>
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
  const [activeTab, setActiveTab] = useState<ClientFormTab>('general')

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    trigger,
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
  const country = useWatch({ control, name: 'country' })
  const ubigeoCode = useWatch({ control, name: 'ubigeoCode' })
  const region = useWatch({ control, name: 'region' })
  const province = useWatch({ control, name: 'province' })
  const district = useWatch({ control, name: 'district' })

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

  const submit = handleSubmit(
    (data) => {
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
    },
    (formErrors) => setActiveTab(tabForErrors(formErrors))
  )

  const steps: WizardStep[] = [
    { id: 'general', label: t.form.sectionGeneral },
    { id: 'location', label: t.form.sectionLocation },
    { id: 'contact', label: t.form.sectionContact, optional: true },
  ]

  const goToStep = (id: string) => setActiveTab(id as ClientFormTab)

  const handleNext = async () => {
    const ok = await trigger(
      TAB_FIELDS[activeTab] as (keyof CreateClientFormData)[]
    )
    if (!ok) return
    const i = steps.findIndex((s) => s.id === activeTab)
    if (i < steps.length - 1) goToStep(steps[i + 1].id)
  }

  const handleBack = () => {
    const i = steps.findIndex((s) => s.id === activeTab)
    if (i > 0) goToStep(steps[i - 1].id)
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col items-stretch gap-5 md:flex-row md:items-start">
        <div className="flex w-full shrink-0 flex-col items-center gap-4 rounded-xl border border-border bg-surface p-6 md:w-60">
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

        <div className="flex min-w-0 flex-1 flex-col gap-6 rounded-xl border border-border bg-surface p-6">
          <Wizard
            steps={steps}
            current={activeTab}
            onStepChange={goToStep}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            backLabel={t.form.back}
            nextLabel={t.form.next}
            submitLabel={mode === 'create' ? t.form.create : t.form.save}
            cancelLabel={t.form.cancel}
            optionalLabel={t.form.optional}
          >

          <div
            hidden={activeTab !== 'general'}
            className="animate-tab-fade flex flex-col gap-6"
          >
            <Grid>
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
              <InputField label={t.form.industry} {...register('industry')} />
              <Select
                label={t.form.status}
                options={statusOptions}
                value={status ?? 'active'}
                lang={language}
                onChange={(e) =>
                  setValue('status', e.target.value as 'active' | 'inactive')
                }
              />
            </Grid>
          </div>

          <div
            hidden={activeTab !== 'location'}
            className="animate-tab-fade flex flex-col gap-6"
          >
            <Grid>
              <LocationSelect
                value={{ countryCode: country, ubigeoCode, region, province, district }}
                onChange={(v) => {
                  setValue('country', v.countryCode ?? '')
                  setValue('ubigeoCode', v.ubigeoCode)
                  setValue('region', v.region)
                  setValue('province', v.province)
                  setValue('district', v.district)
                }}
                countryLabel={t.form.country}
                regionLabel={t.form.region}
                cityLabel={t.form.province}
                lang={language}
              />
              <InputField label={t.form.address} {...register('address')} />
            </Grid>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div
            hidden={activeTab !== 'contact'}
            className="animate-tab-fade flex flex-col gap-6"
          >
            <SubHeading>{t.form.sectionOther}</SubHeading>
            <Grid>
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
              <InputNumber
                label={t.form.phone}
                mask="### ### ###"
                {...register('phone')}
              />
              <InputField label={t.form.language} {...register('language')} />
              <InputField
                label={t.form.currency}
                helperText={t.form.currencyHint}
                variant={errors.currency ? 'error' : undefined}
                errorMessage={errors.currency?.message}
                {...register('currency')}
              />
            </Grid>

            <SubHeading>{t.form.sectionContact}</SubHeading>
            <Grid>
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
              <InputNumber
                label={t.form.contactPhone}
                mask="### ### ###"
                {...register('primaryContact.phone')}
              />
              <InputField
                label={t.form.contactPosition}
                {...register('primaryContact.position')}
              />
            </Grid>

            <TextArea
              label={t.form.notes}
              rows={4}
              maxLength={2000}
              showCount
              variant={errors.notes ? 'error' : 'default'}
              errorMessage={errors.notes?.message}
              {...register('notes')}
            />
          </div>
          </Wizard>
        </div>
      </div>
    </form>
  )
}
