import { useState } from 'react'
import { InputNumber, Select, Button, SectionLabel, Spinner } from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import type { Language } from '@/shared/i18n'
import { useProductTranslation } from '../../i18n'
import {
  useLocationsForProductPicker,
  useProductStock,
  useAdjustProductStock,
} from '../../api/products.queries'
import type {
  ProductVariantFormData,
  ProductVariantOptionFormData,
} from '../../model/product.schema'

export interface ProductInventoryPanelProps {
  productId: string
  hasVariants: boolean
  variants: ProductVariantFormData[]
  variantOptions: ProductVariantOptionFormData[]
  language: Language
}

function variantLabel(
  variant: ProductVariantFormData,
  variantOptions: ProductVariantOptionFormData[],
  language: Language
): string {
  return variantOptions
    .map((option, i) => {
      const name = option.name[language] || `#${i + 1}`
      const optionKey = `option-${i}`
      const value = variant.optionValues[optionKey] ?? ''
      return `${name}: ${value}`
    })
    .join(' / ')
}

export const ProductInventoryPanel = ({
  productId,
  hasVariants,
  variants,
  variantOptions,
  language,
}: ProductInventoryPanelProps) => {
  const { t } = useProductTranslation()
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [quantities, setQuantities] = useState<Record<string, string>>({})

  const { data: locations } = useLocationsForProductPicker()
  const { data: stock, isFetching } = useProductStock(productId)
  const adjustStock = useAdjustProductStock()

  const variantSelectOptions = variants.map((v, i) => ({
    value: v.id ?? String(i),
    label: variantLabel(v, variantOptions, language) || `#${i + 1}`,
  }))

  const currentVariantId = hasVariants
    ? selectedVariantId || variantSelectOptions[0]?.value || ''
    : undefined

  const quantityFor = (locationId: string): number => {
    const row = stock?.byLocation.find(
      (r) => r.locationId === locationId && (r.variantId ?? '') === (currentVariantId ?? '')
    )
    return row?.quantity ?? 0
  }

  const handleSave = (locationId: string) => {
    const key = `${locationId}:${currentVariantId ?? ''}`
    const raw = quantities[key]
    const quantity = raw !== undefined ? Number(raw) : quantityFor(locationId)
    if (Number.isNaN(quantity) || quantity < 0) return
    adjustStock.mutate(
      {
        productId,
        ...(currentVariantId ? { variantId: currentVariantId } : {}),
        locationId,
        quantity,
      },
      {
        onSuccess: () => notify.success(t.form.inventoryUpdated),
        onError: onQueuedOr(() => {}),
      }
    )
  }

  if (hasVariants && variantSelectOptions.length === 0) {
    return <p className="text-secondary text-sm">{t.form.noVariantsYet}</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {hasVariants && (
        <Select
          label={t.form.variants}
          options={variantSelectOptions}
          value={currentVariantId ?? ''}
          lang={language}
          onChange={(e) => setSelectedVariantId(e.target.value)}
        />
      )}

      <div className="flex items-center gap-2">
        <SectionLabel>{t.form.sectionInventory}</SectionLabel>
        {isFetching && <Spinner size="small" />}
      </div>
      <p className="text-secondary text-sm">{t.form.inventoryHint}</p>

      <div className="flex flex-col gap-3">
        {(locations ?? []).map((location) => {
          const key = `${location.id}:${currentVariantId ?? ''}`
          return (
            <div
              key={location.id}
              className="border-border bg-surface-subtle flex items-end gap-3 rounded-lg border p-3"
            >
              <div className="flex-1">
                <InputNumber
                  key={key}
                  label={location.name}
                  min={0}
                  defaultValue={String(quantityFor(location.id))}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="small"
                loading={adjustStock.isPending}
                onClick={() => handleSave(location.id)}
              >
                {t.form.inventorySave}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
