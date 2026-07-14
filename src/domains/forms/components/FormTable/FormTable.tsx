import { Can, Chip, DataTable, IconButton, Tooltip, type DataTableColumn } from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { useFormsTranslation } from '../../i18n'
import type { Form } from '../../model/form.types'

interface FormTableProps {
  forms: Form[]
  isLoading: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onEdit: (form: Form) => void
  onDelete: (form: Form) => void
  onViewSubmissions: (form: Form) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export const FormTable = ({
  forms,
  isLoading,
  total,
  page,
  pages,
  onPageChange,
  onEdit,
  onDelete,
  onViewSubmissions,
  selectedIds,
  onSelectionChange,
}: FormTableProps) => {
  const { t, language } = useFormsTranslation()

  const columns: DataTableColumn<Form>[] = [
    {
      id: 'title',
      header: t.table.colTitle,
      cell: (form) => (
        <span className="font-medium text-foreground">{form.title[language] || form.title.en}</span>
      ),
    },
    {
      id: 'status',
      header: t.table.colStatus,
      cell: (form) => (
        <Chip size="small" variant={form.status === 'active' ? 'success' : 'default'}>
          {t.status[form.status]}
        </Chip>
      ),
    },
    {
      id: 'fields',
      header: t.table.colFields,
      cellClassName: 'text-secondary',
      cell: (form) => form.fields.length,
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (form) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip heading={t.table.viewSubmissions} position="top" size="small">
            <IconButton
              icon="RiInboxLine"
              variant="text"
              size="small"
              aria-label={t.table.viewSubmissions}
              onClick={() => onViewSubmissions(form)}
            />
          </Tooltip>
          <Can anyOf={CAN.formsUpdate}>
            <Tooltip heading={t.table.editForm} position="top" size="small">
              <IconButton
                icon="RiPencilLine"
                variant="text"
                size="small"
                aria-label={t.table.editForm}
                onClick={() => onEdit(form)}
              />
            </Tooltip>
          </Can>
          <Can anyOf={CAN.formsDelete}>
            <Tooltip heading={t.table.deleteForm} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.table.deleteForm}
                onClick={() => onDelete(form)}
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
      rows={forms}
      getRowKey={(form) => form.id}
      isLoading={isLoading}
      emptyIcon="RiFileList3Line"
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
