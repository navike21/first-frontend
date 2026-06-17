import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { navPaths } from '@/shared/router'
import { useUserGroupsTranslation } from '../i18n'
import { useUserGroup } from '..'
import {
  useGroupMembers,
  useUserSearch,
  useAddGroupMembers,
  useRemoveGroupMember,
  useRemoveGroupMembersBulk,
} from '../api/members.queries'
import type { GroupMember } from '../model/userGroup.types'

export function useGroupUsersPage() {
  const navigate = useNavigate()
  const { groupId } = useParams({ strict: false }) as { groupId: string }
  const { t, language } = useUserGroupsTranslation()

  const { data: group } = useUserGroup(groupId)

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [removingUser, setRemovingUser] = useState<GroupMember | null>(null)
  const [bulkRemoveOpen, setBulkRemoveOpen] = useState(false)

  // Debounce the search term to avoid a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  const { data, isLoading } = useGroupMembers(groupId, { page, limit: 10 })
  const search = useUserSearch(debouncedTerm)
  const addMembers = useAddGroupMembers(groupId)
  const removeMember = useRemoveGroupMember(groupId)
  const removeBulk = useRemoveGroupMembersBulk(groupId)

  const memberIds = useMemo(
    () => new Set((data?.items ?? []).map((m) => m.id)),
    [data]
  )
  const searchResults = useMemo(
    () => (search.data ?? []).filter((u) => !memberIds.has(u.id)),
    [search.data, memberIds]
  )

  const clearSelection = () => setSelectedIds([])

  const handleAdd = (userId: string) =>
    addMembers.mutate([userId], {
      onSuccess: () => {
        notify.success(t.members.toastAdded)
        setSearchTerm('')
      },
      onError: (error) => notify.queryError(error),
    })

  const handleConfirmRemove = () => {
    if (!removingUser) return
    removeMember.mutate(removingUser.id, {
      onSuccess: () => {
        notify.success(t.members.toastRemoved)
        setRemovingUser(null)
      },
      onError: (error) => notify.queryError(error),
    })
  }

  const handleConfirmBulkRemove = () => {
    removeBulk.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(t.members.toastBulkRemoved)
        clearSelection()
        setBulkRemoveOpen(false)
      },
      onError: (error) => notify.queryError(error),
    })
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    clearSelection()
  }

  const goBack = () => navigate({ to: navPaths.userGroups(language) as never })

  return {
    t,
    group,
    data,
    isLoading,
    page,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching: search.isFetching && debouncedTerm.length > 0,
    hasSearchTerm: debouncedTerm.length > 0,
    adding: addMembers.isPending,
    selectedIds,
    setSelectedIds,
    clearSelection,
    removingUser,
    setRemovingUser,
    bulkRemoveOpen,
    setBulkRemoveOpen,
    removeMember,
    removeBulk,
    handleAdd,
    handleConfirmRemove,
    handleConfirmBulkRemove,
    handlePageChange,
    goBack,
  }
}
