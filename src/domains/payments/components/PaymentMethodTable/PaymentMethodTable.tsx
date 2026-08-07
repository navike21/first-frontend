import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { usePaymentsTranslation } from '../../i18n'
import { useCustomersForPaymentPicker } from '../../api/paymentMethods.queries'
import type { PaymentMethod } from '../../model/payment.types'

interface PaymentMethodTableProps {
  methods: PaymentMethod[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (method: PaymentMethod) => void
  onEdit: (method: PaymentMethod) => void
  onDelete: (method: PaymentMethod) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const PaymentMethodTable = ({
  methods,
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
}: PaymentMethodTableProps) => {
  const { t } = usePaymentsTranslation()
  const { data: customers } = useCustomersForPaymentPicker()

  const customerNameFor = (customerId: string): string => {
    const customer = customers?.find((c) => c.id === customerId)
    return customer ? `${customer.firstName} ${customer.lastName}` : customerId
  }

  const columns: DataTableColumn<PaymentMethod>[] = [
    {
      id: 'customer',
      header: t.table.colCustomer,
      cell: (method) => (
        <span className="text-foreground font-medium">
          {customerNameFor(method.customerId)}
        </span>
      ),
    },
    {
      id: 'provider',
      header: t.table.colProvider,
      cellClassName: 'text-secondary',
      cell: (method) => method.provider,
    },
    {
      id: 'card',
      header: t.table.colCard,
      cellClassName: 'text-secondary font-mono',
      cell: (method) => `${method.brand} •••• ${method.last4}`,
    },
    {
      id: 'expiry',
      header: t.table.colExpiry,
      cellClassName: 'text-secondary',
      cell: (method) =>
        `${String(method.expiryMonth).padStart(2, '0')}/${method.expiryYear}`,
    },
    {
      id: 'default',
      header: t.table.colDefault,
      cell: (method) => (
        <Chip size="small" variant={method.isDefault ? 'success' : 'default'}>
          {method.isDefault ? t.status.yes : t.status.no}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (method) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewMethod} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewMethod}
              onClick={() => onView(method)}
            />
          </Tooltip>
          <Can anyOf={CAN.paymentMethodsUpdate}>
            <Tooltip heading={t.table.editMethod} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editMethod}
                onClick={() => onEdit(method)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.paymentMethodsDelete}>
            <Tooltip heading={t.table.deleteMethod} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteMethod}
                onClick={() => onDelete(method)}
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
      rows={methods}
      getRowKey={(method) => method.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiBankCardLine"
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
