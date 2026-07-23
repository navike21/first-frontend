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
import { useSubscribersTranslation } from '../../i18n'
import type { Subscriber } from '../../model/subscriber.types'

interface SubscriberTableProps {
  subscribers: Subscriber[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (subscriber: Subscriber) => void
  onEdit: (subscriber: Subscriber) => void
  onDelete: (subscriber: Subscriber) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const SubscriberTable = ({
  subscribers,
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
}: SubscriberTableProps) => {
  const { t } = useSubscribersTranslation()

  const columns: DataTableColumn<Subscriber>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (sub) => {
        const fullName = `${sub.firstName} ${sub.lastName}`
        return (
          <div className="flex items-center gap-3">
            <Avatar
              alt={fullName}
              src={sub.personalInformation.profilePictureUrl}
              name={fullName}
              size="sm"
            />
            <span className="text-foreground font-medium">{fullName}</span>
          </div>
        )
      },
    },
    {
      id: 'email',
      header: t.table.colEmail,
      cellClassName: 'text-secondary',
      cell: (sub) => sub.contactInformation.email,
    },
    {
      id: 'gender',
      header: t.table.colGender,
      cellClassName: 'text-secondary',
      cell: (sub) => t.genders[sub.personalInformation.gender],
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (sub) => (
        <Chip
          size="small"
          variant={sub.status === 'active' ? 'success' : 'default'}
        >
          {t.status[sub.status]}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (sub) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewSubscriber} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewSubscriber}
              onClick={() => onView(sub)}
            />
          </Tooltip>
          <Can anyOf={CAN.subscribersUpdate}>
            <Tooltip
              heading={t.table.editSubscriber}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editSubscriber}
                onClick={() => onEdit(sub)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.subscribersDelete}>
            <Tooltip
              heading={t.table.deleteSubscriber}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteSubscriber}
                onClick={() => onDelete(sub)}
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
      rows={subscribers}
      getRowKey={(sub) => sub.id}
      isLoading={isLoading}
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
