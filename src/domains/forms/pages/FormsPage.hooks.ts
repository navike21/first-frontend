import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import { useForms, useSoftDeleteForm, useBulkSoftDeleteForms } from '../api/forms.queries'
import { useFormsTranslation } from '../i18n'
import type { Form, FormListParams, FormPaginationMeta } from '../model/form.types'

export function useFormsPage() {
  const navigate = useNavigate()
  const { t, language } = useFormsTranslation()
  const [params, setParams] = useState<FormListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingForm, setDeletingForm] = useState<Form | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading } = useForms({ ...params, search: search || undefined })
  const softDelete = useSoftDeleteForm()
  const bulkSoftDelete = useBulkSoftDeleteForms()

  const forms = data?.data ?? []
  const meta = data?.meta as FormPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleEdit = (form: Form) => navigate({ to: navPaths.formEdit(form.id, language) as never })
  const handleDelete = (form: Form) => setDeletingForm(form)
  const handleViewSubmissions = (form: Form) =>
    navigate({ to: navPaths.formSubmissions(form.id, language) as never })

  const handleConfirmDelete = () => {
    if (!deletingForm) return
    softDelete.mutate(deletingForm.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingForm(null)
      },
      onError: onQueuedOr(() => setDeletingForm(null)),
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

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setParams((p) => ({ ...p, page: 1 }))
    clearSelection()
  }

  const handleStatusChange = (value: string) => {
    setParams((p) => ({
      ...p,
      page: 1,
      status: value === 'all' ? undefined : (value as 'active' | 'inactive'),
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'active', label: t.filters.statusActive },
    { value: 'inactive', label: t.filters.statusInactive },
  ]

  return {
    t,
    language,
    params,
    search,
    forms,
    total,
    page,
    pages,
    isLoading,
    deletingForm,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleEdit,
    handleDelete,
    handleViewSubmissions,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingForm,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
