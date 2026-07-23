import {
  Can,
  Chip,
  DataTable,
  IconButton,
  Tooltip,
  type DataTableColumn,
} from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/i18n'
import { useFormsTranslation } from '../../i18n'
import type { Form, FormSubmission } from '../../model/form.types'

interface FormSubmissionTableProps {
  form: Form
  submissions: FormSubmission[]
  isLoading: boolean
  isFetching?: boolean
  total: number
  page: number
  pages: number
  onPageChange: (page: number) => void
  onView: (submission: FormSubmission) => void
  onDelete: (submission: FormSubmission) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

function previewValue(
  form: Form,
  data: Record<string, unknown>,
  language: Language
): string {
  for (const field of form.fields) {
    const value = data[field.fieldId ?? '']
    if (value === undefined || value === null || value === '') continue
    const label = field.label[language] || field.label.en || ''
    return label ? `${label}: ${String(value)}` : String(value)
  }
  return '—'
}

export const FormSubmissionTable = ({
  form,
  submissions,
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
}: FormSubmissionTableProps) => {
  const { t, language } = useFormsTranslation()

  const columns: DataTableColumn<FormSubmission>[] = [
    {
      id: 'date',
      header: t.submissionsTable.colDate,
      cellClassName: 'text-secondary',
      cell: (submission) => formatDate(submission.createdAt),
    },
    {
      id: 'preview',
      header: t.submissionsTable.colPreview,
      cell: (submission) => (
        <span className="text-foreground line-clamp-1">
          {previewValue(form, submission.data, language)}
        </span>
      ),
    },
    {
      id: 'status',
      header: t.submissionsTable.colStatus,
      cell: (submission) => (
        <Chip size="small" variant={submission.isRead ? 'default' : 'success'}>
          {submission.isRead
            ? t.submissionsTable.statusRead
            : t.submissionsTable.statusUnread}
        </Chip>
      ),
    },
    {
      id: 'actions',
      header: t.submissionsTable.colActions,
      align: 'right',
      cell: (submission) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip
            heading={t.submissionsTable.viewSubmission}
            position="top"
            size="small"
          >
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.submissionsTable.viewSubmission}
              onClick={() => onView(submission)}
            />
          </Tooltip>
          <Can anyOf={CAN.formSubmissionsDelete}>
            <Tooltip
              heading={t.submissionsTable.deleteSubmission}
              position="top"
              size="small"
            >
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.submissionsTable.deleteSubmission}
                onClick={() => onDelete(submission)}
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
      rows={submissions}
      getRowKey={(submission) => submission.id}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyIcon="RiInboxLine"
      emptyLabel={t.submissionsTable.noResults}
      totalLabel={t.submissionsTable.totalCount(total)}
      pagination={{
        page,
        pages,
        onPageChange,
        prevLabel: t.submissionsTable.prevPage,
        nextLabel: t.submissionsTable.nextPage,
      }}
      selectable={!!onSelectionChange}
      {...(selectedIds !== undefined && { selectedIds })}
      {...(onSelectionChange !== undefined && { onSelectionChange })}
      selectAllLabel={t.submissionsTable.selectAll}
      selectRowLabel={t.submissionsTable.selectRow}
    />
  )
}
