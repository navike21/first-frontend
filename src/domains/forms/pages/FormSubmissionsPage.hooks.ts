import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { useForm as useFormQuery } from '../api/forms.queries'
import {
  useFormSubmissions,
  useMarkFormSubmissionRead,
  useSoftDeleteFormSubmission,
  useBulkSoftDeleteFormSubmissions,
} from '../api/forms.queries'
import { useFormsTranslation } from '../i18n'
import type { FormSubmission, FormPaginationMeta } from '../model/form.types'

export function useFormSubmissionsPage() {
  const { t, language } = useFormsTranslation()
  const { formId } = useParams({ strict: false }) as { formId: string }
  const { data: form } = useFormQuery(formId)

  const [page, setPage] = useState(1)
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [viewing, setViewing] = useState<FormSubmission | null>(null)
  const [deleting, setDeleting] = useState<FormSubmission | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const isRead = readFilter === 'all' ? undefined : readFilter === 'read'
  const { data, isLoading } = useFormSubmissions(formId, {
    page,
    limit: 20,
    isRead,
  })
  const markRead = useMarkFormSubmissionRead(formId)
  const softDelete = useSoftDeleteFormSubmission(formId)
  const bulkSoftDelete = useBulkSoftDeleteFormSubmissions(formId)

  const submissions = data?.data ?? []
  const meta = data?.meta as FormPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (submission: FormSubmission) => {
    setViewing(submission)
    if (!submission.isRead) markRead.mutate(submission.id)
  }
  const handleDelete = (submission: FormSubmission) => setDeleting(submission)

  const handleConfirmDelete = () => {
    if (!deleting) return
    softDelete.mutate(deleting.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeleting(null)
      },
      onError: onQueuedOr(() => setDeleting(null)),
    })
  }

  const handleConfirmBulkDelete = () => {
    bulkSoftDelete.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(t.toasts.bulkDeleted)
        clearSelection()
        setBulkConfirmOpen(false)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkConfirmOpen(false)
      }),
    })
  }

  const handleReadFilterChange = (value: string) => {
    setReadFilter(value as 'all' | 'read' | 'unread')
    setPage(1)
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setPage(next)
    clearSelection()
  }

  const readOptions = [
    { value: 'all', label: t.filters.readAll },
    { value: 'read', label: t.filters.readRead },
    { value: 'unread', label: t.filters.readUnread },
  ]

  return {
    t,
    language,
    form,
    readFilter,
    submissions,
    total,
    page,
    pages,
    isLoading,
    viewing,
    deleting,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    readOptions,
    handleView,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleReadFilterChange,
    handlePageChange,
    setViewing,
    setDeleting,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
