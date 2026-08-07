import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useInventoryTranslation } from '../../i18n'
import type { Location } from '../../model/location.types'

interface LocationTableProps {
  locations: Location[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (location: Location) => void
  onEdit: (location: Location) => void
  onDelete: (location: Location) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const LocationTable = ({
  locations,
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
}: LocationTableProps) => {
  const { t } = useInventoryTranslation()

  const columns: DataTableColumn<Location>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (location) => (
        <span className="text-foreground font-medium">{location.name}</span>
      ),
    },
    {
      id: 'type',
      header: t.table.colType,
      cellClassName: 'text-secondary',
      cell: (location) =>
        location.type === 'warehouse' ? t.type.warehouse : t.type.store,
    },
    {
      id: 'fulfillsOnline',
      header: t.table.colFulfillsOnline,
      cell: (location) => (
        <Chip
          size="small"
          variant={location.fulfillsOnline ? 'success' : 'default'}
        >
          {location.fulfillsOnline ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (location) => (
        <Chip size="small" variant={location.isActive ? 'success' : 'default'}>
          {location.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (location) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewLocation} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewLocation}
              onClick={() => onView(location)}
            />
          </Tooltip>
          <Can anyOf={CAN.inventoryUpdate}>
            <Tooltip heading={t.table.editLocation} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editLocation}
                onClick={() => onEdit(location)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.inventoryDelete}>
            <Tooltip
              heading={t.table.deleteLocation}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteLocation}
                onClick={() => onDelete(location)}
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
      rows={locations}
      getRowKey={(location) => location.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiStore2Line"
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
