import { useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { useUserGroupsTrash, useRestoreUserGroup, usePurgeUserGroup } from '..'
import { useHasPermission } from '@/shared/lib/permissions'
import { useUserGroupsTranslation } from '../i18n'
import type { UserGroup } from '..'

export function useUserGroupsTrashPage() {
  const { t, language } = useUserGroupsTranslation()
  const [page, setPage] = useState(1)
  const [restoringGroup, setRestoringGroup] = useState<UserGroup | null>(null)
  const [purgingGroup, setPurgingGroup] = useState<UserGroup | null>(null)

  const canRestore = useHasPermission(
    'user-groups:update',
    'user-groups:manage',
    '*:*'
  )
  // Purge (physical delete) requires explicit `:purge` or super-root `*:*` —
  // `:manage` does NOT grant it (matches the backend's purge gating).
  const canPurge = useHasPermission('user-groups:purge', '*:*')

  const { data, isLoading } = useUserGroupsTrash({ page, limit: 20 })
  const restore = useRestoreUserGroup()
  const purge = usePurgeUserGroup()

  const handleConfirmRestore = () => {
    if (!restoringGroup) return
    restore.mutate(restoringGroup.id, {
      onSuccess: () => {
        notify.success(t.toasts.restored)
        setRestoringGroup(null)
      },
      onError: (error) => notify.queryError(error),
    })
  }

  const handleConfirmPurge = () => {
    if (!purgingGroup) return
    purge.mutate(purgingGroup.id, {
      onSuccess: () => {
        notify.success(t.toasts.purged)
        setPurgingGroup(null)
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
    restoringGroup,
    purgingGroup,
    canRestore,
    canPurge,
    restore,
    purge,
    setPage,
    setRestoringGroup,
    setPurgingGroup,
    handleConfirmRestore,
    handleConfirmPurge,
  }
}
