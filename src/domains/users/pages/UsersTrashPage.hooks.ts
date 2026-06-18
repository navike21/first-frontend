import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import {
  useUsersTrash,
  useRestoreUser,
  usePurgeUser,
  useBulkRestoreUsers,
  useBulkPurgeUsers,
} from '..'
import { useHasPermission } from '@/shared/lib/permissions'
import { useUsersTranslation } from '../i18n'
import type { User } from '..'

export function useUsersTrashPage() {
  const { t, language } = useUsersTranslation()
  const [page, setPage] = useState(1)
  const [restoringUser, setRestoringUser] = useState<User | null>(null)
  const [purgingUser, setPurgingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkRestoreOpen, setBulkRestoreOpen] = useState(false)
  const [bulkPurgeOpen, setBulkPurgeOpen] = useState(false)

  const canRestore = useHasPermission('users:update', 'users:manage', '*:*')
  // Purge (physical delete) requires explicit `:purge` or super-root `*:*` —
  // `:manage` does NOT grant it (matches the backend's purge gating).
  const canPurge = useHasPermission('users:purge', '*:*')

  const { data, isLoading } = useUsersTrash({ page, limit: 20 })
  const restore = useRestoreUser()
  const purge = usePurgeUser()
  const bulkRestore = useBulkRestoreUsers()
  const bulkPurge = useBulkPurgeUsers()

  const clearSelection = () => setSelectedIds([])

  const handleConfirmRestore = () => {
    if (!restoringUser) return
    restore.mutate(restoringUser.id, {
      onSuccess: () => {
        notify.success(t.toasts.restored)
        setRestoringUser(null)
      },
      onError: onQueuedOr(() => setRestoringUser(null)),
    })
  }

  const handleConfirmPurge = () => {
    if (!purgingUser) return
    purge.mutate(purgingUser.id, {
      onSuccess: () => {
        notify.success(t.toasts.purged)
        setPurgingUser(null)
      },
      onError: onQueuedOr(() => setPurgingUser(null)),
    })
  }

  const handleConfirmBulkRestore = () => {
    bulkRestore.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(t.toasts.bulkRestored)
        clearSelection()
        setBulkRestoreOpen(false)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkRestoreOpen(false)
      }),
    })
  }

  const handleConfirmBulkPurge = () => {
    bulkPurge.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(t.toasts.bulkPurged)
        clearSelection()
        setBulkPurgeOpen(false)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkPurgeOpen(false)
      }),
    })
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    clearSelection()
  }

  return {
    t,
    language,
    page,
    data,
    isLoading,
    restoringUser,
    purgingUser,
    viewingUser,
    selectedIds,
    bulkRestoreOpen,
    bulkPurgeOpen,
    canRestore,
    canPurge,
    restore,
    purge,
    bulkRestore,
    bulkPurge,
    setRestoringUser,
    setPurgingUser,
    setViewingUser,
    setSelectedIds,
    setBulkRestoreOpen,
    setBulkPurgeOpen,
    handlePageChange,
    handleConfirmRestore,
    handleConfirmPurge,
    handleConfirmBulkRestore,
    handleConfirmBulkPurge,
  }
}
