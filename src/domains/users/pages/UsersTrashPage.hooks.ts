import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { useUsersTrash, useRestoreUser, usePurgeUser } from '..'
import { useHasPermission } from '@/shared/lib/permissions'
import { useUsersTranslation } from '../i18n'
import type { User } from '..'

export function useUsersTrashPage() {
  const { t, language } = useUsersTranslation()
  const [page, setPage] = useState(1)
  const [restoringUser, setRestoringUser] = useState<User | null>(null)
  const [purgingUser, setPurgingUser] = useState<User | null>(null)

  const canRestore = useHasPermission('users:update', 'users:manage', '*:*')
  // Purge (physical delete) requires explicit `:purge` or super-root `*:*` —
  // `:manage` does NOT grant it (matches the backend's purge gating).
  const canPurge = useHasPermission('users:purge', '*:*')

  const { data, isLoading } = useUsersTrash({ page, limit: 20 })
  const restore = useRestoreUser()
  const purge = usePurgeUser()

  const handleConfirmRestore = () => {
    if (!restoringUser) return
    restore.mutate(restoringUser.id, {
      onSuccess: () => {
        notify.success(t.toasts.restored)
        setRestoringUser(null)
      },
      onError: (error) => notify.queryError(error),
    })
  }

  const handleConfirmPurge = () => {
    if (!purgingUser) return
    purge.mutate(purgingUser.id, {
      onSuccess: () => {
        notify.success(t.toasts.purged)
        setPurgingUser(null)
      },
      onError: (error) => notify.queryError(error),
    })
  }

  return {
    t,
    language,
    page,
    data,
    isLoading,
    restoringUser,
    purgingUser,
    canRestore,
    canPurge,
    restore,
    purge,
    setPage,
    setRestoringUser,
    setPurgingUser,
    handleConfirmRestore,
    handleConfirmPurge,
  }
}
