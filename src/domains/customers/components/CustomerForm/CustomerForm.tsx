import { useEffect, useMemo } from 'react'
import {
  useForm,
  useFieldArray,
  useWatch,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  InputPhone,
  Select,
  TextArea,
  Switch,
  Button,
  ButtonGroup,
  FormGrid,
  SectionLabel,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useConfigData } from '@/shared/api/config'
import { useCustomersTranslation } from '../../i18n'
import { createCustomerSchema } from '../../model/customer.schema'
import type { CustomerFormData } from '../../model/customer.schema'
import { CustomerAddressCard } from './CustomerAddressCard'

export interface CustomerFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<CustomerFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: CustomerFormData) => void
}

export const CustomerForm = ({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: CustomerFormProps) => {
  const { t, language } = useCustomersTranslation()
  const { data: config } = useConfigData(['documentTypes'], language)
  const documentTypes = config?.documentTypes
  const schema = useMemo(
    () => createCustomerSchema(t.validation),
    [t.validation]
  )

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(schema) as Resolver<CustomerFormData>,
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentType: '',
      documentNumber: '',
      addresses: [],
      notes: '',
      status: 'active',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  })

  const documentType = useWatch({ control, name: 'documentType' })
  const statusValue = useWatch({ control, name: 'status' })
  const addressesValues = useWatch({ control, name: 'addresses' })

  const documentTypeOptions = [
    { value: '', label: t.form.documentTypeNone },
    ...(documentTypes ?? []).map((d) => ({ value: d.value, label: d.label })),
  ]

  const handleAddAddress = () =>
    append({
      type: 'shipping',
      isDefault: fields.length === 0,
      country: '',
      ubigeoCode: '',
      region: '',
      province: '',
      district: '',
      address: '',
      addressNumber: '',
      addressInterior: '',
    })

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-6">
        <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
          <SectionLabel>{t.form.sectionGeneral}</SectionLabel>

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
            <InputField
              label={requiredLabel(t.form.email)}
              type="email"
              variant={errors.email ? 'error' : undefined}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <InputPhone label={t.form.phone} {...register('phone')} />
            <Select
              label={t.form.documentType}
              options={documentTypeOptions}
              value={documentType ?? ''}
              lang={language}
              onChange={(e) =>
                setValue(
                  'documentType',
                  e.target.value as CustomerFormData['documentType']
                )
              }
            />
            <InputField
              label={t.form.documentNumber}
              variant={errors.documentNumber ? 'error' : undefined}
              errorMessage={errors.documentNumber?.message}
              {...register('documentNumber')}
            />
          </FormGrid>

          <TextArea
            label={t.form.notes}
            rows={4}
            maxLength={2000}
            showCount
            variant={errors.notes ? 'error' : 'default'}
            errorMessage={errors.notes?.message}
            {...register('notes')}
          />

          <Switch
            label={t.form.isActive}
            checked={statusValue === 'active'}
            onChange={(e) =>
              setValue('status', e.target.checked ? 'active' : 'inactive')
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-6">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>{t.form.sectionAddresses}</SectionLabel>
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={handleAddAddress}
            >
              {t.form.addAddress}
            </Button>
          </div>

          {fields.map((field, index) => (
            <CustomerAddressCard
              key={field.id}
              index={index}
              control={control}
              register={register}
              language={language}
              typeValue={addressesValues?.[index]?.type ?? 'shipping'}
              isDefaultValue={addressesValues?.[index]?.isDefault ?? false}
              onTypeChange={(value) =>
                setValue(`addresses.${index}.type`, value, {
                  shouldDirty: true,
                })
              }
              onIsDefaultChange={(value) =>
                setValue(`addresses.${index}.isDefault`, value, {
                  shouldDirty: true,
                })
              }
              onRemove={() => remove(index)}
            />
          ))}
        </div>

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
