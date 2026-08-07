import { useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PageContent,
  InputField,
  InputNumber,
  TextArea,
  Button,
  ButtonGroup,
  FormGrid,
  SectionLabel,
  LocationSelect,
  LangTabs,
  Spinner,
} from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { useScopedEditingLanguage } from '@/shared/lib'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useContentLanguages } from '@/domains/site-config'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import {
  useEcommerceSettings,
  useUpdateEcommerceSettings,
} from '../api/ecommerceSettings.queries'
import { useEcommerceSettingsTranslation } from '../i18n'
import {
  createEcommerceSettingsSchema,
  toEcommerceSettingsPayload,
} from '../model/ecommerceSettings.schema'
import type { EcommerceSettingsFormData } from '../model/ecommerceSettings.schema'

export const EcommerceSettingsPage = () => {
  const { t, language } = useEcommerceSettingsTranslation()
  const { languages } = useContentLanguages()
  const { editingLanguage, setEditingLanguage } = useScopedEditingLanguage(
    languages,
    language
  )
  const { data: settings, isLoading } = useEcommerceSettings()
  const updateSettings = useUpdateEcommerceSettings()
  const canUpdate = useHasPermission(...CAN.ecommerceSettingsUpdate)

  const schema = useMemo(
    () => createEcommerceSettingsSchema(t.validation),
    [t.validation]
  )

  const emptyLocalized = useMemo(
    () =>
      Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as Record<
        Language,
        string
      >,
    []
  )

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<EcommerceSettingsFormData>({
    resolver: zodResolver(schema) as Resolver<EcommerceSettingsFormData>,
    mode: 'onTouched',
    defaultValues: {
      currency: '',
      taxPercentage: 0,
      country: '',
      ubigeoCode: '',
      region: '',
      province: '',
      district: '',
      address: '',
      addressNumber: '',
      addressInterior: '',
      checkoutPolicies: { ...emptyLocalized },
    },
  })

  useEffect(() => {
    if (!settings) return
    reset({
      currency: settings.currency,
      taxPercentage: settings.taxPercentage,
      country: settings.storeOriginAddress.country ?? '',
      ubigeoCode: settings.storeOriginAddress.ubigeoCode ?? '',
      region: settings.storeOriginAddress.region ?? '',
      province: settings.storeOriginAddress.province ?? '',
      district: settings.storeOriginAddress.district ?? '',
      address: settings.storeOriginAddress.address ?? '',
      addressNumber: settings.storeOriginAddress.addressNumber ?? '',
      addressInterior: settings.storeOriginAddress.addressInterior ?? '',
      checkoutPolicies: { ...emptyLocalized, ...settings.checkoutPolicies },
    })
  }, [settings, reset, emptyLocalized])

  const checkoutPoliciesValues = useWatch({
    control,
    name: 'checkoutPolicies',
  })

  const hasContent = (lang: Language): boolean =>
    !!checkoutPoliciesValues?.[lang]?.trim()

  const submit = handleSubmit((data) => {
    updateSettings.mutate(toEcommerceSettingsPayload(data), {
      onSuccess: () => notify.success(t.toasts.updated),
      onError: onQueuedOr(() => {}),
    })
  })

  if (isLoading) {
    return (
      <PageContent title={t.page.title} description={t.page.description}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent title={t.page.title} description={t.page.description}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-6">
          <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
            <SectionLabel>{t.form.sectionGeneral}</SectionLabel>
            <FormGrid>
              <InputField
                label={t.form.currency}
                variant={errors.currency ? 'error' : undefined}
                errorMessage={errors.currency?.message}
                maxLength={3}
                {...register('currency')}
              />
              <InputNumber
                label={t.form.taxPercentage}
                decimals={2}
                min={0}
                max={100}
                variant={errors.taxPercentage ? 'error' : undefined}
                errorMessage={errors.taxPercentage?.message}
                {...register('taxPercentage')}
              />
            </FormGrid>
          </div>

          <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-6">
            <div className="flex flex-col gap-1">
              <SectionLabel>{t.form.sectionOriginAddress}</SectionLabel>
              <p className="text-secondary text-sm">
                {t.form.originAddressHint}
              </p>
            </div>
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
          </div>

          <div className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-6">
            <div className="flex flex-col gap-1">
              <SectionLabel>{t.form.sectionCheckoutPolicies}</SectionLabel>
              <p className="text-secondary text-sm">
                {t.form.checkoutPoliciesHint}
              </p>
            </div>
            {languages.length > 1 && (
              <LangTabs
                languages={languages}
                editingLanguage={editingLanguage}
                userLanguage={language}
                hasContent={hasContent}
                hasError={() => false}
                onChange={setEditingLanguage}
              />
            )}
            <TextArea
              label={t.form.checkoutPolicies}
              rows={6}
              value={checkoutPoliciesValues?.[editingLanguage] ?? ''}
              onChange={(e) =>
                setValue(
                  `checkoutPolicies.${editingLanguage}`,
                  e.target.value,
                  { shouldDirty: true }
                )
              }
            />
          </div>

          {canUpdate && (
            <ButtonGroup className="border-border border-t pt-4">
              <Button
                type="button"
                variant="primary"
                loading={updateSettings.isPending}
                onClick={() => {
                  void submit()
                }}
              >
                {t.form.save}
              </Button>
            </ButtonGroup>
          )}
        </div>
      </form>
    </PageContent>
  )
}
