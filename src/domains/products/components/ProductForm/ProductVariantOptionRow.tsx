import type { UseFormRegister } from 'react-hook-form'
import { InputField, IconButton, LangBadge, Tooltip, FormGrid } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { useProductTranslation } from '../../i18n'
import type { ProductFormData } from '../../model/product.schema'

export interface ProductVariantOptionRowProps {
  index: number
  register: UseFormRegister<ProductFormData>
  editingLanguage: Language
  onRemove: () => void
}

export const ProductVariantOptionRow = ({
  index,
  register,
  editingLanguage,
  onRemove,
}: ProductVariantOptionRowProps) => {
  const { t } = useProductTranslation()

  return (
    <div className="border-border bg-surface-subtle flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-foreground text-sm font-semibold">
          {t.form.variantOptions} {index + 1}
        </span>
        <Tooltip heading={t.form.removeVariantOption} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={t.form.removeVariantOption}
            onClick={onRemove}
          />
        </Tooltip>
      </div>
      <FormGrid>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-secondary text-xs font-medium">
              {t.form.variantOptionName}
            </span>
            <LangBadge lang={editingLanguage} />
          </div>
          <InputField
            {...register(`variantOptions.${index}.name.${editingLanguage}`)}
          />
        </div>
        <InputField
          label={t.form.variantOptionValues}
          helperText={t.form.variantOptionValuesHint}
          {...register(`variantOptions.${index}.valuesText`)}
        />
      </FormGrid>
    </div>
  )
}
