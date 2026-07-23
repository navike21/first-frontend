import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useTagsTranslation } from '../../i18n'
import type { Tag } from '../../model/tag.types'

interface TagTableProps {
  tags: Tag[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (tag: Tag) => void
  onEdit: (tag: Tag) => void
  onDelete: (tag: Tag) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const TagTable = ({
  tags,
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
}: TagTableProps) => {
  const { t, language } = useTagsTranslation()

  const columns: DataTableColumn<Tag>[] = [
    {
      id: 'name',
      header: t.table.colName,
      cell: (tag) => (
        <span className="text-foreground font-medium">
          {tag.name[language] || tag.name.en}
        </span>
      ),
    },
    {
      id: 'slug',
      header: t.table.colSlug,
      cellClassName: 'text-secondary',
      cell: (tag) => tag.slug,
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (tag) => (
        <Chip size="small" variant={tag.isActive ? 'success' : 'default'}>
          {tag.isActive ? t.status.active : t.status.inactive}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (tag) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewTag} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewTag}
              onClick={() => onView(tag)}
            />
          </Tooltip>
          <Can anyOf={CAN.tagsUpdate}>
            <Tooltip heading={t.table.editTag} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editTag}
                onClick={() => onEdit(tag)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.tagsDelete}>
            <Tooltip heading={t.table.deleteTag} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteTag}
                onClick={() => onDelete(tag)}
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
      rows={tags}
      getRowKey={(tag) => tag.id}
      isLoading={isLoading}
      emptyIcon="RiPriceTag3Line"
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
