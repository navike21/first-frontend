import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { membersApi } from './members.api'
import { userGroupKeys } from './userGroups.queries'
import type { GroupMemberListParams } from '../model/userGroup.types'

export const memberKeys = {
  all: (groupId: string) => [...userGroupKeys.detail(groupId), 'members'] as const,
  list: (groupId: string, params: GroupMemberListParams) =>
    [...memberKeys.all(groupId), params] as const,
  search: (term: string) => ['user-search', term] as const,
}

export const useGroupMembers = (
  groupId: string,
  params: GroupMemberListParams = {}
) =>
  useQuery({
    queryKey: memberKeys.list(groupId, params),
    queryFn: () => membersApi.list(groupId, params),
    select: (res) => res.data,
    enabled: !!groupId,
  })

/** Searches users to add (only runs once a term is provided). */
export const useUserSearch = (term: string) =>
  useQuery({
    queryKey: memberKeys.search(term),
    queryFn: () => membersApi.searchUsers({ search: term, limit: 10 }),
    select: (res) => res.data.items,
    enabled: term.trim().length > 0,
  })

export const useAddGroupMembers = (groupId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userIds: string[]) => membersApi.add(groupId, userIds),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: memberKeys.all(groupId) }),
  })
}

export const useRemoveGroupMember = (groupId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => membersApi.remove(groupId, userId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: memberKeys.all(groupId) }),
  })
}
