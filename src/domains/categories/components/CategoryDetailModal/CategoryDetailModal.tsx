import { Modal, Chip, DetailField } from '@/shared/ui'
import { useCategoriesTranslation } from '../../i18n'
import { useCategoriesForPicker } from '../../api/categories.queries'
import type { Category } from '../../model/category.types'

interface CategoryDetailModalProps {
  category: Category | null
  onClose: () => void
}

export const CategoryDetailModal = ({ category, onClose }: CategoryDetailModalProps) => {
  const { t, language } = useCategoriesTranslation()
  const { data: allCategories } = useCategoriesForPicker()

  const parentName = (() => {
    if (!category?.parentId) return t.form.noParent
    const parent = allCategories?.find((c) => c.id === category.parentId)
    return parent ? parent.name[language] || parent.name.en : category.parentId
  })()

  return (
    <Modal isOpen={!!category} onClose={onClose} size="lg" title={t.table.viewCategory}>
      {category && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">
                {category.name[language] || category.name.en}
              </span>
              <Chip size="x-small" variant={category.isActive ? 'success' : 'default'}>
                {category.isActive ? t.status.active : t.status.inactive}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label={t.table.colSlug} value={category.slug} />
            <DetailField label={t.form.parent} value={parentName} />
            <DetailField label={t.form.order} value={String(category.order)} />
          </div>
        </div>
      )}
    </Modal>
  )
}
