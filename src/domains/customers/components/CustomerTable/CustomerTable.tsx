import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useCustomersTranslation } from '../../i18n'
import type { Customer } from '../../model/customer.types'

interface CustomerTableProps {
  customers: Customer[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (customer: Customer) => void
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const CustomerTable = ({
  customers,
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
}: CustomerTableProps) => {
  const { t } = useCustomersTranslation()

  const columns: DataTableColumn<Customer>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (customer) => (
        <span className="text-foreground font-medium">
          {customer.firstName} {customer.lastName}
        </span>
      ),
    },
    {
      id: 'email',
      header: t.table.colEmail,
      cellClassName: 'text-secondary',
      cell: (customer) => customer.email,
    },
    {
      id: 'phone',
      header: t.table.colPhone,
      cellClassName: 'text-secondary',
      cell: (customer) => customer.phone || '—',
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (customer) => (
        <Chip
          size="small"
          variant={customer.status === 'active' ? 'success' : 'default'}
        >
          {customer.status === 'active' ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (customer) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewCustomer} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewCustomer}
              onClick={() => onView(customer)}
            />
          </Tooltip>
          <Can anyOf={CAN.customersUpdate}>
            <Tooltip heading={t.table.editCustomer} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editCustomer}
                onClick={() => onEdit(customer)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.customersDelete}>
            <Tooltip
              heading={t.table.deleteCustomer}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteCustomer}
                onClick={() => onDelete(customer)}
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
      rows={customers}
      getRowKey={(customer) => customer.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiUserLine"
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
