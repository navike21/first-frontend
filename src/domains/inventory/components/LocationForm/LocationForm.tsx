import { useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InputField,
  Select,
  Switch,
  Button,
  ButtonGroup,
  FormGrid,
  SectionLabel,
  LocationSelect,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import { useInventoryTranslation } from '../../i18n'
import { createLocationSchema } from '../../model/location.schema'
import type { LocationFormData } from '../../model/location.schema'

export interface LocationFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<LocationFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: LocationFormData) => void
}

export const LocationForm = ({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: LocationFormProps) => {
  const { t, language } = useInventoryTranslation()
  const schema = useMemo(
    () => createLocationSchema(t.validation),
    [t.validation]
  )

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(schema) as Resolver<LocationFormData>,
    mode: 'onTouched',
    defaultValues: {
      name: '',
      type: 'warehouse',
      country: '',
      ubigeoCode: '',
      region: '',
      province: '',
      district: '',
      address: '',
      addressNumber: '',
      addressInterior: '',
      fulfillsOnline: true,
      isActive: true,
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const typeValue = useWatch({ control, name: 'type' })
  const fulfillsOnlineValue = useWatch({ control, name: 'fulfillsOnline' })
  const isActiveValue = useWatch({ control, name: 'isActive' })

  const typeOptions = [
    { value: 'warehouse', label: t.type.warehouse },
    { value: 'store', label: t.type.store },
  ]

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
        <FormGrid>
          <InputField
            label={requiredLabel(t.form.name)}
            variant={errors.name ? 'error' : undefined}
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <Select
            label={t.form.type}
            options={typeOptions}
            value={typeValue ?? 'warehouse'}
            lang={language}
            onChange={(e) =>
              setValue('type', e.target.value as LocationFormData['type'])
            }
          />
        </FormGrid>

        <SectionLabel>{t.form.sectionAddress}</SectionLabel>
        <LocationSelect
          control={control}
          names={{
            countryCode: 'country',
            ubigeoCode: 'ubigeoCode',
            region: 'region',
            province: 'province',
            district: 'district',
          }}
          countryLabel={t.form.country}
          regionLabel={t.form.region}
          cityLabel={t.form.province}
          lang={language}
        />
        <FormGrid>
          <InputField
            label={t.form.address}
            autoComplete="address-line1"
            {...register('address')}
          />
          <InputField
            label={t.form.addressNumber}
            autoComplete="off"
            {...register('addressNumber')}
          />
          <InputField
            label={t.form.addressInterior}
            autoComplete="address-line2"
            {...register('addressInterior')}
          />
        </FormGrid>

        <FormGrid>
          <Switch
            label={t.form.fulfillsOnline}
            checked={fulfillsOnlineValue}
            onChange={(e) => setValue('fulfillsOnline', e.target.checked)}
            disabled={isSubmitting}
          />
          <Switch
            label={t.form.isActive}
            checked={isActiveValue}
            onChange={(e) => setValue('isActive', e.target.checked)}
            disabled={isSubmitting}
          />
        </FormGrid>

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
