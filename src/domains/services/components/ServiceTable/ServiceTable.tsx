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
import { useServicesTranslation } from '../../i18n'
import type { Service } from '../../model/service.types'

interface ServiceTableProps {
  services: Service[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (service: Service) => void
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const ServiceTable = ({
  services,
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
}: ServiceTableProps) => {
  const { t, language } = useServicesTranslation()

  const columns: DataTableColumn<Service>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (svc) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={svc.name[language] || svc.name.en}
            src={svc.coverImageUrl}
            name={svc.name[language] || svc.name.en}
            size="sm"
          />
          <span className="font-medium text-foreground">
            {svc.name[language] || svc.name.en}
          </span>
        </div>
      ),
    },
    {
      id: 'pillars',
      header: t.table.colPillars,
      cellClassName: 'text-secondary',
      cell: (svc) => svc.pillars.length,
    },
    {
      id: 'order',
      header: t.table.colOrder,
      cellClassName: 'text-secondary',
      cell: (svc) => svc.order,
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (svc) => (
        <Chip
          size="small"
          variant={svc.status === 'active' ? 'success' : 'default'}
        >
          {t.status[svc.status]}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (svc) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewService} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewService}
              onClick={() => onView(svc)}
            />
          </Tooltip>
          <Can anyOf={CAN.servicesUpdate}>
            <Tooltip heading={t.table.editService} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editService}
                onClick={() => onEdit(svc)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.servicesDelete}>
            <Tooltip heading={t.table.deleteService} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteService}
                onClick={() => onDelete(svc)}
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
      rows={services}
      getRowKey={(svc) => svc.id}
      isLoading={isLoading}
      emptyIcon="RiToolsLine"
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
