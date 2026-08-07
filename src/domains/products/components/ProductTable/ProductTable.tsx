import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { CAN } from '@/shared/lib/permissions'
import { useProductTranslation } from '../../i18n'
import type { Product, ProductStatus } from '../../model/product.types'

interface ProductTableProps {
  products: Product[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

const STATUS_VARIANT: Record<ProductStatus, 'success' | 'default' | 'warning'> = {
  active: 'success',
  draft: 'default',
  archived: 'warning',
}

export const ProductTable = ({
  products,
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
}: ProductTableProps) => {
  const { t, language } = useProductTranslation()

  const columns: DataTableColumn<Product>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (product) => (
        <span className="text-foreground font-medium">
          {product.name[language] || product.name.en}
        </span>
      ),
    },
    {
      id: 'sku',
      header: t.table.colSku,
      cellClassName: 'text-secondary',
      cell: (product) => product.sku || '—',
    },
    {
      id: 'price',
      header: t.table.colPrice,
      cellClassName: 'text-secondary',
      cell: (product) =>
        formatCurrency(product.price.amount, product.price.currency, language),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (product) => (
        <Chip size="small" variant={STATUS_VARIANT[product.status]}>
          {t.status[product.status]}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (product) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewProduct} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewProduct}
              onClick={() => onView(product)}
            />
          </Tooltip>
          <Can anyOf={CAN.productsUpdate}>
            <Tooltip heading={t.table.editProduct} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editProduct}
                onClick={() => onEdit(product)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.productsDelete}>
            <Tooltip heading={t.table.deleteProduct} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteProduct}
                onClick={() => onDelete(product)}
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
      rows={products}
      getRowKey={(product) => product.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiPriceTag3Line"
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
