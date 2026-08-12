import { Can, Chip, DataTable, IconButton, Tooltip, type DataTableColumn } from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { formatDate } from '@/shared/lib/formatDate'
import { useOrdersTranslation } from '../../i18n'
import type { Order, OrderStatus, PaymentStatus } from '../../model/order.types'

const STATUS_CHIP_VARIANT: Record<OrderStatus, 'default' | 'success' | 'warning' | 'informative' | 'error'> = {
  pending: 'default',
  confirmed: 'informative',
  processing: 'warning',
  shipped: 'informative',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'default',
}

const PAYMENT_STATUS_CHIP_VARIANT: Record<PaymentStatus, 'default' | 'success' | 'warning' | 'informative' | 'error'> = {
  unpaid: 'warning',
  partially_paid: 'warning',
  paid: 'success',
  refunded: 'default',
}

interface OrderTableProps {
  orders: Order[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (order: Order) => void
  onDelete?: (order: Order) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const OrderTable = ({
  orders,
  isLoading,
  isFetching,
  total,
  page,
  pages,
  onPageChange,
  onView,
  onDelete,
  selectedIds,
  onSelectionChange,
}: OrderTableProps) => {
  const { t, language } = useOrdersTranslation()

  const columns: DataTableColumn<Order>[] = [
    {
      id: 'orderNumber',
      header: t.table.colOrderNumber,
      cell: (order) => (
        <span className="text-foreground font-mono font-medium">{order.orderNumber}</span>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (order) => (
        <Chip size="small" variant={STATUS_CHIP_VARIANT[order.status]}>
          {t.status[order.status]}
        </Chip>
      ),
    },
    {
      id: 'paymentStatus',
      header: t.table.colPaymentStatus,
      cell: (order) => (
        <Chip size="small" variant={PAYMENT_STATUS_CHIP_VARIANT[order.paymentStatus]}>
          {t.paymentStatus[order.paymentStatus]}
        </Chip>
      ),
    },
    {
      id: 'total',
      header: t.table.colTotal,
      cellClassName: 'text-secondary',
      cell: (order) => formatCurrency(order.total.amount, order.total.currency, language),
    },
    {
      id: 'date',
      header: t.table.colDate,
      cellClassName: 'text-secondary',
      cell: (order) => (order.createdAt ? formatDate(order.createdAt) : '—'),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (order) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewOrder} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewOrder}
              onClick={() => onView(order)}
            />
          </Tooltip>
          {onDelete && (
            <Can anyOf={CAN.ordersDelete}>
              <Tooltip heading={t.table.deleteOrder} position="top" size="small">
                <IconButton
                  icon="RiDeleteBinLine"
                  variant="text"
                  size="small"
                  aria-label={t.table.deleteOrder}
                  onClick={() => onDelete(order)}
                />
              </Tooltip>
            </Can>
          )}
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={orders}
      getRowKey={(order) => order.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiShoppingCart2Line"
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
