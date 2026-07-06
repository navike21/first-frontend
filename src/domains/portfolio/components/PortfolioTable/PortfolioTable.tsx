import {
  Avatar,
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatDate } from '@/shared/lib/formatDate'
import { usePortfolioTranslation } from '../../i18n'
import type { Portfolio } from '../../model/portfolio.types'

interface PortfolioTableProps {
  items: Portfolio[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (item: Portfolio) => void
  onEdit: (item: Portfolio) => void
  onDelete: (item: Portfolio) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

const STATUS_VARIANT = {
  published: 'success',
  draft: 'warning',
  archived: 'default',
} as const

export const PortfolioTable = ({
  items,
  isLoading,
  total,
  page,
  pages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: PortfolioTableProps) => {
  const { t, language } = usePortfolioTranslation()

  const columns: DataTableColumn<Portfolio>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={item.name[language] || item.name.en}
            src={item.coverImageUrl}
            name={item.name[language] || item.name.en}
            size="sm"
          />
          <div className="min-w-0">
            <span className="block truncate font-medium text-foreground">
              {item.name[language] || item.name.en}
            </span>
            {item.featured && (
              <span className="text-[11px] font-medium text-primary-600">★ Featured</span>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (item) => (
        <Chip size="small" variant={STATUS_VARIANT[item.status]}>
          {t.status[item.status]}
        </Chip>
      ),
    },
    {
      id: 'services',
      header: t.table.colServices,
      cellClassName: 'text-secondary',
      cell: (item) => item.serviceIds.length,
    },
    {
      id: 'startDate',
      header: t.table.colDate,
      cellClassName: 'text-secondary',
      cell: (item) => formatDate(item.startDate),
    },
    {
      id: 'order',
      header: t.table.colOrder,
      cellClassName: 'text-secondary',
      cell: (item) => item.order,
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewItem} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewItem}
              onClick={() => onView(item)}
            />
          </Tooltip>
          <Can anyOf={CAN.portfolioUpdate}>
            <Tooltip heading={t.table.editItem} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editItem}
                onClick={() => onEdit(item)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.portfolioDelete}>
            <Tooltip heading={t.table.deleteItem} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteItem}
                onClick={() => onDelete(item)}
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
      rows={items}
      getRowKey={(item) => item.id}
      isLoading={isLoading}
      emptyIcon="RiGalleryLine"
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
