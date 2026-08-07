import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useProductCategoriesTranslation } from '../../i18n'
import { useProductCategoriesForPicker } from '../../api/productCategories.queries'
import type { ProductCategory } from '../../model/productCategory.types'

interface ProductCategoryTableProps {
  categories: ProductCategory[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (category: ProductCategory) => void
  onEdit: (category: ProductCategory) => void
  onDelete: (category: ProductCategory) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const ProductCategoryTable = ({
  categories,
  isLoading,
  isFetching,
  total,
  page,
  pages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: ProductCategoryTableProps) => {
  const { t, language } = useProductCategoriesTranslation()
  const { data: allCategories } = useProductCategoriesForPicker()

  const parentNameFor = (parentId: string | null | undefined): string => {
    if (!parentId) return '—'
    const parent = allCategories?.find((c) => c.id === parentId)
    return parent ? parent.name[language] || parent.name.en : '—'
  }

  const columns: DataTableColumn<ProductCategory>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (category) => (
        <span className="text-foreground font-medium">
          {category.name[language] || category.name.en}
        </span>
      ),
    },
    {
      id: 'slug',
      header: t.table.colSlug,
      cellClassName: 'text-secondary',
      cell: (category) => category.slug[language] || category.slug.en,
    },
    {
      id: 'parent',
      header: t.table.colParent,
      cellClassName: 'text-secondary',
      cell: (category) => parentNameFor(category.parentId),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (category) => (
        <Chip size="small" variant={category.isActive ? 'success' : 'default'}>
          {category.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewCategory} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewCategory}
              onClick={() => onView(category)}
            />
          </Tooltip>
          <Can anyOf={CAN.productCategoriesUpdate}>
            <Tooltip heading={t.table.editCategory} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editCategory}
                onClick={() => onEdit(category)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.productCategoriesDelete}>
            <Tooltip
              heading={t.table.deleteCategory}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteCategory}
                onClick={() => onDelete(category)}
              />
            </Tooltip>
          </Can>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={categories}
      getRowKey={(category) => category.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiFolderLine"
      emptyLabel={t.table.noResults}
      totalLabel={t.table.totalCount(total)}
      pagination={{
        page,
        pages,
        onPageChange,
        prevLabel: t.table.prevPage,
        nextLabel: t.table.nextPage,
      }}
      selectable={!!onSelectionChange}
      {...(selectedIds !== undefined && { selectedIds })}
      {...(onSelectionChange !== undefined && { onSelectionChange })}
      selectAllLabel={t.table.selectAll}
      selectRowLabel={t.table.selectRow}
    />
  )
}
