import {
  Avatar,
  Can,
  Chip,
  CountryLabel,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useConfig, labelFor } from '@/shared/api/config'
import { useClientsTranslation } from '../../i18n'
import type { Client } from '../../model/client.types'

interface ClientTableProps {
  clients: Client[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (client: Client) => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const ClientTable = ({
  clients,
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
}: ClientTableProps) => {
  const { t, language } = useClientsTranslation()
  const { data: config } = useConfig(['industries'], language)

  const columns: DataTableColumn<Client>[] = [
    {
      id: 'businessName',
      header: t.table.colBusinessName,
      cell: (client) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={client.businessName}
            src={client.logoUrl}
            name={client.businessName}
            size="sm"
          />
          <span className="font-medium text-foreground">
            {client.businessName}
          </span>
        </div>
      ),
    },
    {
      id: 'type',
      header: t.table.colType,
      cellClassName: 'text-secondary',
      cell: (client) => t.clientType[client.clientType],
    },
    {
      id: 'country',
      header: t.table.colCountry,
      cellClassName: 'text-secondary',
      cell: (client) => <CountryLabel code={client.country} />,
    },
    {
      id: 'industry',
      header: t.table.colIndustry,
      cellClassName: 'text-secondary',
      cell: (client) => labelFor(config?.industries, client.industry) || '—',
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (client) => (
        <Chip
          size="small"
          variant={client.status === 'active' ? 'success' : 'default'}
        >
          {t.status[client.status]}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (client) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewClient} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewClient}
              onClick={() => onView(client)}
            />
          </Tooltip>
          <Can anyOf={CAN.clientsUpdate}>
            <Tooltip heading={t.table.editClient} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editClient}
                onClick={() => onEdit(client)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.clientsDelete}>
            <Tooltip heading={t.table.deleteClient} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteClient}
                onClick={() => onDelete(client)}
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
      rows={clients}
      getRowKey={(client) => client.id}
      isLoading={isLoading}
      emptyIcon="RiBuilding4Line"
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
