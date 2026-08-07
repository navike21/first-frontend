import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { useShippingTranslation } from '../../i18n'
import type { ShippingRule } from '../../model/shippingRule.types'

interface ShippingRuleTableProps {
  rules: ShippingRule[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (rule: ShippingRule) => void
  onEdit: (rule: ShippingRule) => void
  onDelete: (rule: ShippingRule) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const ShippingRuleTable = ({
  rules,
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
}: ShippingRuleTableProps) => {
  const { t, language } = useShippingTranslation()

  const columns: DataTableColumn<ShippingRule>[] = [
    {
      id: 'order',
      header: t.table.colOrder,
      cellClassName: 'text-secondary',
      cell: (rule) => String(rule.order),
    },
    {
      id: 'name',
      header: t.table.colName,
      cell: (rule) => (
        <span className="text-foreground font-medium">{rule.name}</span>
      ),
    },
    {
      id: 'type',
      header: t.table.colType,
      cellClassName: 'text-secondary',
      cell: (rule) => t.type[rule.type],
    },
    {
      id: 'amount',
      header: t.table.colAmount,
      cellClassName: 'text-secondary',
      cell: (rule) => formatCurrency(rule.amount.amount, rule.amount.currency, language),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (rule) => (
        <Chip size="small" variant={rule.isActive ? 'success' : 'default'}>
          {rule.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (rule) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewRule} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewRule}
              onClick={() => onView(rule)}
            />
          </Tooltip>
          <Can anyOf={CAN.shippingUpdate}>
            <Tooltip heading={t.table.editRule} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editRule}
                onClick={() => onEdit(rule)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.shippingDelete}>
            <Tooltip heading={t.table.deleteRule} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteRule}
                onClick={() => onDelete(rule)}
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
      rows={rules}
      getRowKey={(rule) => rule.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiTruckLine"
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
