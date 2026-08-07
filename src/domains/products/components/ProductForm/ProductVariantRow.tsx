import type { UseFormRegister } from 'react-hook-form'
import { InputField, PriceInput, IconButton, Tooltip, FormGrid } from '@/shared/ui'
import { currencySymbol } from '@/shared/lib/formatCurrency'
import type { Language } from '@/shared/i18n'
import { useProductTranslation } from '../../i18n'
import type {
  ProductFormData,
  ProductVariantOptionFormData,
} from '../../model/product.schema'

export interface ProductVariantRowProps {
  index: number
  register: UseFormRegister<ProductFormData>
  language: Language
  currency: string
  optionValues: Record<string, string>
  variantOptions: ProductVariantOptionFormData[]
  onRemove: () => void
}

export const ProductVariantRow = ({
  index,
  register,
  language,
  currency,
  optionValues,
  variantOptions,
  onRemove,
}: ProductVariantRowProps) => {
  const { t } = useProductTranslation()

  const label = variantOptions
    .map((option, i) => {
      const name = option.name[language] || t.form.variants
      const optionKey = `option-${i}`
      const value = optionValues[optionKey] ?? ''
      return `${name}: ${value}`
    })
    .join(' / ')

  return (
    <div className="border-border bg-surface-subtle flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-foreground text-sm font-semibold">{label}</span>
        <Tooltip heading={t.form.removeVariant} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={t.form.removeVariant}
            onClick={onRemove}
          />
        </Tooltip>
      </div>
      <FormGrid>
        <InputField
          label={t.form.variantSku}
          {...register(`variants.${index}.sku`)}
        />
        <PriceInput
          label={t.form.variantPrice}
          prefix={currencySymbol(currency, language)}
          {...register(`variants.${index}.price`)}
        />
        <PriceInput
          label={t.form.variantCompareAtPrice}
          prefix={currencySymbol(currency, language)}
          {...register(`variants.${index}.compareAtPrice`)}
        />
        <InputField
          label={t.form.ogImage}
          {...register(`variants.${index}.imageUrl`)}
        />
      </FormGrid>
    </div>
  )
}
