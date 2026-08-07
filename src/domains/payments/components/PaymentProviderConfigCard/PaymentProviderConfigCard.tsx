import { useEffect, useMemo } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputField, Switch, Button, ButtonGroup, FormGrid } from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { usePaymentsTranslation } from '../../i18n'
import { useUpdateProviderConfig } from '../../api/providerConfig.queries'
import {
  createProviderConfigCardSchema,
  toProviderConfigPayload,
} from '../../model/providerConfig.schema'
import type { ProviderConfigCardFormData } from '../../model/providerConfig.schema'
import type { PaymentProviderConfig } from '../../model/payment.types'

interface PaymentProviderConfigCardProps {
  config: PaymentProviderConfig
}

export const PaymentProviderConfigCard = ({ config }: PaymentProviderConfigCardProps) => {
  const { t } = usePaymentsTranslation()
  const schema = useMemo(
    () => createProviderConfigCardSchema(config.fields),
    [config.fields]
  )
  const updateConfig = useUpdateProviderConfig()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<ProviderConfigCardFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<ProviderConfigCardFormData>,
    mode: 'onTouched',
    defaultValues: {
      enabled: config.enabled,
      isDefault: config.isDefault,
      ...Object.fromEntries(
        config.fields.map((f) => [f.key, f.type === 'password' ? '' : (config.config[f.key] ?? '')])
      ),
    },
  })

  useEffect(() => {
    reset({
      enabled: config.enabled,
      isDefault: config.isDefault,
      ...Object.fromEntries(
        config.fields.map((f) => [f.key, f.type === 'password' ? '' : (config.config[f.key] ?? '')])
      ),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.provider, config.enabled, config.isDefault])

  const enabledValue = useWatch({ control, name: 'enabled' })
  const isDefaultValue = useWatch({ control, name: 'isDefault' })

  const submit = handleSubmit((data) => {
    updateConfig.mutate(
      {
        provider: config.provider,
        body: {
          enabled: data.enabled,
          isDefault: data.isDefault,
          ...(config.fields.length > 0 && {
            config: toProviderConfigPayload(config.fields, data),
          }),
        },
      },
      {
        onSuccess: () => notify.success(t.toasts.providerUpdated),
        onError: onQueuedOr(() => {}),
      }
    )
  })

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-foreground text-base font-bold">{config.label}</span>
          <Switch
            label={t.form.enabled}
            checked={enabledValue}
            onChange={(e) =>
              setValue('enabled', e.target.checked, { shouldDirty: true })
            }
          />
        </div>

        {config.fields.length > 0 && (
          <FormGrid>
            {config.fields.map((field) => (
              <InputField
                key={field.key}
                type={field.type === 'password' ? 'password' : 'text'}
                label={field.required ? requiredLabel(field.label) : field.label}
                helperText={
                  field.type === 'password' ? t.form.secretFieldHint : undefined
                }
                variant={errors[field.key] ? 'error' : undefined}
                errorMessage={(errors[field.key] as { message?: string })?.message}
                {...register(field.key)}
              />
            ))}
          </FormGrid>
        )}

        <Switch
          label={t.form.isDefault}
          checked={isDefaultValue}
          onChange={(e) =>
            setValue('isDefault', e.target.checked, { shouldDirty: true })
          }
        />

        <ButtonGroup className="border-border border-t pt-4">
          <Button
            type="button"
            variant="primary"
            loading={updateConfig.isPending}
            onClick={() => {
              void submit()
            }}
          >
            {t.form.saveProvider}
          </Button>
        </ButtonGroup>
      </div>
    </form>
  )
}
