import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useFormsTrash,
  useRestoreForm,
  usePurgeForm,
  useBulkRestoreForms,
  useBulkPurgeForms,
} from '../api/forms.queries'
import { useFormsTranslation } from '../i18n'
import type { Form, FormPaginationMeta } from '../model/form.types'

export function useFormsTrashPage() {
  const { t, language } = useFormsTranslation()
  const [page, setPage] = useState(1)
  const [restoring, setRestoring] = useState<Form | null>(null)
  const [purging, setPurging] = useState<Form | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'restore' | 'purge' | null>(null)

  const { data, isLoading, isFetching } = useFormsTrash({ page, limit: 20 })
  const restore = useRestoreForm()
  const purge = usePurgeForm()
  const bulkRestore = useBulkRestoreForms()
  const bulkPurge = useBulkPurgeForms()

  const forms = Array.isArray(data?.data) ? data.data : []
  const meta = data?.meta as FormPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1

  const clearSelection = () => setSelectedIds([])

  const formTitle = (f: Form) => f.title[language] || f.title.en

  const handleConfirmRestore = () => {
    if (!restoring) return
    restore.mutate(restoring.id, {
      onSuccess: () => {
        notify.success(t.toasts.restored)
        setRestoring(null)
      },
      onError: onQueuedOr(() => setRestoring(null)),
    })
  }

  const handleConfirmPurge = () => {
    if (!purging) return
    purge.mutate(purging.id, {
      onSuccess: () => {
        notify.success(t.toasts.purged)
        setPurging(null)
      },
      onError: onQueuedOr(() => setPurging(null)),
    })
  }

  const handleConfirmBulk = () => {
    const mutation = bulkAction === 'restore' ? bulkRestore : bulkPurge
    const toast =
      bulkAction === 'restore' ? t.toasts.bulkRestored : t.toasts.bulkPurged
    mutation.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(toast)
        clearSelection()
        setBulkAction(null)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkAction(null)
      }),
    })
  }

  const handlePageChange = (next: number) => {
    setPage(next)
    clearSelection()
  }

  return {
    t,
    language,
    forms,
    total,
    pages,
    page,
    isLoading,
    isFetching,
    restoring,
    purging,
    selectedIds,
    bulkAction,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    formTitle,
    setRestoring,
    setPurging,
    setSelectedIds,
    setBulkAction,
    clearSelection,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulk,
    handlePageChange,
  }
}
