import { Modal, Chip, DetailField } from '@/shared/ui'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { useProductTranslation } from '../../i18n'
import type { Product, ProductStatus } from '../../model/product.types'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
}

const STATUS_VARIANT: Record<ProductStatus, 'success' | 'default' | 'warning'> = {
  active: 'success',
  draft: 'default',
  archived: 'warning',
}

export const ProductDetailModal = ({
  product,
  onClose,
}: ProductDetailModalProps) => {
  const { t, language } = useProductTranslation()

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      size="lg"
      title={t.table.viewProduct}
    >
      {product && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-base font-bold">
                {product.name[language] || product.name.en}
              </span>
              <Chip size="x-small" variant={STATUS_VARIANT[product.status]}>
                {t.status[product.status]}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.table.colSku} value={product.sku || '—'} />
            <DetailField
              label={t.table.colPrice}
              value={formatCurrency(
                product.price.amount,
                product.price.currency,
                language
              )}
            />
            {product.compareAtPrice && (
              <DetailField
                label={t.form.compareAtPrice}
                value={formatCurrency(
                  product.compareAtPrice.amount,
                  product.compareAtPrice.currency,
                  language
                )}
              />
            )}
            <DetailField
              label={t.form.categoryIds}
              value={String(product.categoryIds.length)}
            />
            <DetailField
              label={t.form.tagIds}
              value={String(product.tagIds.length)}
            />
            <DetailField
              label={t.form.gallery}
              value={String(product.gallery.length)}
            />
          </div>

          {product.shortDescription?.[language] && (
            <DetailField
              label={t.form.shortDescription}
              value={product.shortDescription[language]}
            />
          )}

          {product.hasVariants && (
            <div className="flex flex-col gap-2">
              <span className="text-secondary text-sm font-medium">
                {t.form.variants}
              </span>
              <div className="flex flex-col gap-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="border-border bg-surface-subtle flex items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                  >
                    <span className="text-secondary">
                      {Object.values(variant.optionValues).join(' / ') || '—'}
                    </span>
                    <span className="text-foreground font-medium">
                      {formatCurrency(
                        variant.price.amount,
                        variant.price.currency,
                        language
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
