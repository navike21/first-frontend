import { useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PageContent,
  InputField,
  InputNumber,
  Select,
  Button,
  ButtonGroup,
  FormGrid,
  SectionLabel,
  Chip,
  IconComponent,
} from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { useLocationsForPicker } from '../api/locations.queries'
import { useStockByProduct, useAdjustStock } from '../api/stock.queries'
import { useInventoryTranslation } from '../i18n'
import { createAdjustStockSchema } from '../model/stock.schema'
import { toAdjustStockPayload } from '../model/stock.schema'
import type { AdjustStockFormData } from '../model/stock.schema'

export const InventoryStockPage = () => {
  const { t, language } = useInventoryTranslation()
  const [queriedProductId, setQueriedProductId] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data: locations } = useLocationsForPicker()
  const { data: summary, isFetching } = useStockByProduct(queriedProductId)
  const adjustStock = useAdjustStock()

  const schema = createAdjustStockSchema(t.validation)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<AdjustStockFormData>({
    resolver: zodResolver(schema) as Resolver<AdjustStockFormData>,
    mode: 'onTouched',
    defaultValues: {
      productId: '',
      variantId: '',
      locationId: '',
      quantity: 0,
    },
  })

  const locationId = useWatch({ control, name: 'locationId' })

  const locationOptions = (locations ?? []).map((l) => ({
    value: l.id,
    label: l.name,
  }))

  const handleSearch = () => {
    setQueriedProductId(searchInput.trim())
    setValue('productId', searchInput.trim())
  }

  const submit = handleSubmit((data) => {
    adjustStock.mutate(toAdjustStockPayload(data), {
      onSuccess: () => {
        notify.success(t.stock.updated)
        reset({ ...data, quantity: data.quantity })
      },
      onError: onQueuedOr(() => {}),
    })
  })

  return (
    <PageContent
      title={t.page.stockTitle}
      description={t.page.stockDescription}
    >
      <div className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-6">
        <FormGrid>
          <InputField
            label={t.stock.productIdLabel}
            placeholder={t.stock.productIdPlaceholder}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftSlot={
              <span className="text-muted px-3">
                <IconComponent icon="RiSearchLine" className="h-4 w-4" />
              </span>
            }
          />
        </FormGrid>
        <div>
          <Button
            type="button"
            variant="secondary"
            size="small"
            loading={isFetching}
            onClick={handleSearch}
            disabled={!searchInput.trim()}
          >
            {t.stock.search}
          </Button>
        </div>

        {queriedProductId && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <SectionLabel>{t.stock.total}</SectionLabel>
              <Chip size="small">{summary?.total ?? 0}</Chip>
            </div>
            {summary && summary.byLocation.length > 0 ? (
              <div className="border-border divide-border-control divide-y rounded-lg border">
                {summary.byLocation.map((row) => (
                  <div
                    key={`${row.locationId}-${row.variantId ?? 'simple'}`}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {row.locationName}
                      </span>
                      <span className="text-secondary text-xs">
                        {row.variantId
                          ? `${t.stock.variant}: ${row.variantId}`
                          : t.stock.noVariant}
                      </span>
                    </div>
                    <span className="text-foreground font-semibold">
                      {row.quantity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary text-sm">{t.stock.noResults}</p>
            )}
          </div>
        )}
      </div>

      <div className="border-border bg-surface mt-6 flex flex-col gap-4 rounded-xl border p-6">
        <SectionLabel>{t.stock.adjustTitle}</SectionLabel>
        <p className="text-secondary text-sm">{t.stock.adjustDescription}</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <FormGrid>
            <InputField
              label={t.stock.productId}
              variant={errors.productId ? 'error' : undefined}
              errorMessage={errors.productId?.message}
              {...register('productId')}
            />
            <InputField
              label={`${t.stock.variantId} ${t.stock.variantIdOptional}`}
              variant={errors.variantId ? 'error' : undefined}
              errorMessage={errors.variantId?.message}
              {...register('variantId')}
            />
            <Select
              label={t.stock.location}
              options={locationOptions}
              value={locationId ?? ''}
              lang={language}
              onChange={(e) =>
                setValue('locationId', e.target.value, { shouldValidate: true })
              }
            />
            <InputNumber
              label={t.stock.quantity}
              min={0}
              variant={errors.quantity ? 'error' : undefined}
              errorMessage={errors.quantity?.message}
              {...register('quantity')}
            />
          </FormGrid>

          <ButtonGroup className="border-border mt-4 border-t pt-4">
            <Button
              type="button"
              variant="primary"
              loading={adjustStock.isPending}
              onClick={() => {
                void submit()
              }}
            >
              {t.stock.submit}
            </Button>
          </ButtonGroup>
        </form>
      </div>
    </PageContent>
  )
}
