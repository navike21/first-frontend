import { Modal, Chip, DetailField } from '@/shared/ui'
import { useProductCategoriesTranslation } from '../../i18n'
import { useProductCategoriesForPicker } from '../../api/productCategories.queries'
import type { ProductCategory } from '../../model/productCategory.types'

interface ProductCategoryDetailModalProps {
  category: ProductCategory | null
  onClose: () => void
}

export const ProductCategoryDetailModal = ({
  category,
  onClose,
}: ProductCategoryDetailModalProps) => {
  const { t, language } = useProductCategoriesTranslation()
  const { data: allCategories } = useProductCategoriesForPicker()

  const parentName = (() => {
    if (!category?.parentId) return t.form.noParent
    const parent = allCategories?.find((c) => c.id === category.parentId)
    return parent ? parent.name[language] || parent.name.en : category.parentId
  })()

  return (
    <Modal
      isOpen={!!category}
      onClose={onClose}
      size="lg"
      title={t.table.viewCategory}
    >
      {category && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-base font-bold">
                {category.name[language] || category.name.en}
              </span>
              <Chip
                size="x-small"
                variant={category.isActive ? 'success' : 'default'}
              >
                {category.isActive ? t.status.active : t.status.inactive}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField
              label={t.table.colSlug}
              value={category.slug[language] || category.slug.en}
            />
            <DetailField label={t.form.parent} value={parentName} />
            <DetailField label={t.form.order} value={String(category.order)} />
          </div>
        </div>
      )}
    </Modal>
  )
}
