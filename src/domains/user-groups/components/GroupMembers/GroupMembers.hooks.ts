import { useEffect, useMemo, useState } from 'react'
import { notify } from '@/shared/lib/notify'
import { useUserGroupsTranslation } from '../../i18n'
import {
  useGroupMembers,
  useUserSearch,
  useAddGroupMembers,
  useRemoveGroupMember,
} from '../../api/members.queries'

export function useGroupMembersManager(groupId: string) {
  const { t } = useUserGroupsTranslation()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // Debounce the search term to avoid a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  const { data, isLoading } = useGroupMembers(groupId, { page, limit: 10 })
  const search = useUserSearch(debouncedTerm)
  const addMembers = useAddGroupMembers(groupId)
  const removeMember = useRemoveGroupMember(groupId)

  const memberIds = useMemo(
    () => new Set((data?.items ?? []).map((m) => m.id)),
    [data]
  )

  // Hide users already shown as members of the current page from the picker.
  const searchResults = useMemo(
    () => (search.data ?? []).filter((u) => !memberIds.has(u.id)),
    [search.data, memberIds]
  )

  const handleAdd = (userId: string) =>
    addMembers.mutate([userId], {
      onSuccess: () => {
        notify.success(t.members.toastAdded)
        setSearchTerm('')
      },
      onError: (error) => notify.queryError(error),
    })

  const handleRemove = (userId: string) =>
    removeMember.mutate(userId, {
      onSuccess: () => notify.success(t.members.toastRemoved),
      onError: (error) => notify.queryError(error),
    })

  return {
    t,
    data,
    isLoading,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching: search.isFetching && debouncedTerm.length > 0,
    hasSearchTerm: debouncedTerm.length > 0,
    adding: addMembers.isPending,
    handleAdd,
    handleRemove,
  }
}
