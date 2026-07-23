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
import { useConfigData, labelFor } from '@/shared/api/config'
import { useCollaboratorsTranslation } from '../../i18n'
import type { Collaborator } from '../../model/collaborator.types'

interface CollaboratorTableProps {
  collaborators: Collaborator[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (collaborator: Collaborator) => void
  onEdit: (collaborator: Collaborator) => void
  onDelete: (collaborator: Collaborator) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const CollaboratorTable = ({
  collaborators,
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
}: CollaboratorTableProps) => {
  const { t, language } = useCollaboratorsTranslation()
  const { data: configData } = useConfigData(['collaboratorRoles'], language)

  const columns: DataTableColumn<Collaborator>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (collaborator) => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={collaborator.name}
            src={collaborator.photoUrl}
            name={collaborator.name}
            size="sm"
          />
          <span className="text-foreground font-medium">
            {collaborator.name}
          </span>
        </div>
      ),
    },
    {
      id: 'role',
      header: t.table.colRole,
      cellClassName: 'text-secondary',
      cell: (collaborator) =>
        labelFor(configData?.collaboratorRoles, collaborator.role),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (collaborator) => (
        <Chip
          size="small"
          variant={collaborator.isActive ? 'success' : 'default'}
        >
          {collaborator.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (collaborator) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip
            heading={t.table.viewCollaborator}
            position="top"
            size="small"
          >
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewCollaborator}
              onClick={() => onView(collaborator)}
            />
          </Tooltip>
          <Can anyOf={CAN.collaboratorsUpdate}>
            <Tooltip
              heading={t.table.editCollaborator}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editCollaborator}
                onClick={() => onEdit(collaborator)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.collaboratorsDelete}>
            <Tooltip
              heading={t.table.deleteCollaborator}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteCollaborator}
                onClick={() => onDelete(collaborator)}
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
      rows={collaborators}
      getRowKey={(collaborator) => collaborator.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiTeamLine"
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
