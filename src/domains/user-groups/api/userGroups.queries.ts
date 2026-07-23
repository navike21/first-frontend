import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { userGroupsApi } from './userGroups.api'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import type { UserGroup, UserGroupListParams } from '../model/userGroup.types'
import type {
  CreateUserGroupFormData,
  UpdateUserGroupFormData,
} from '../model/userGroup.schema'

export const userGroupKeys = {
  all: ['user-groups'] as const,
  lists: () => [...userGroupKeys.all, 'list'] as const,
  list: (params: UserGroupListParams) =>
    [...userGroupKeys.lists(), params] as const,
  details: () => [...userGroupKeys.all, 'detail'] as const,
  detail: (id: string) => [...userGroupKeys.details(), id] as const,
  catalog: () => [...userGroupKeys.all, 'catalog'] as const,
  trash: () => [...userGroupKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...userGroupKeys.trash(), params] as const,
}

export const useUserGroups = (params: UserGroupListParams = {}) =>
  useQuery({
    queryKey: userGroupKeys.list(params),
    queryFn: () => userGroupsApi.list(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
  })

export const useUserGroup = (id: string) =>
  useQuery({
    queryKey: userGroupKeys.detail(id),
    queryFn: () => userGroupsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useCreateUserGroup = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserGroupFormData) => userGroupsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userGroupKeys.lists() }),
  })
}

export const useUpdateUserGroup = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserGroupFormData) =>
      userGroupsApi.update(id, data),
    onSuccess: (res) => {
      const updated = res.data

      qc.setQueriesData<ApiResponse<PaginatedData<UserGroup>>>(
        { queryKey: userGroupKeys.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((g) =>
                g.id === id ? { ...g, ...updated } : g
              ),
            },
          }
        }
      )

      qc.invalidateQueries({ queryKey: userGroupKeys.lists() })
      qc.invalidateQueries({ queryKey: userGroupKeys.detail(id) })
    },
  })
}

export const useSoftDeleteUserGroup = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userGroupsApi.softDelete(id),
    onSuccess: () => {
      // Invalidate the trash too, so deleting again after a restore refreshes it.
      qc.invalidateQueries({ queryKey: userGroupKeys.lists() })
      qc.invalidateQueries({ queryKey: userGroupKeys.trash() })
    },
  })
}

export const usePermissionsCatalog = () =>
  useQuery({
    queryKey: userGroupKeys.catalog(),
    queryFn: () => userGroupsApi.permissionsCatalog(),
    select: (res) => res.data.permissions,
    staleTime: Infinity,
  })

export const useUserGroupsTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: userGroupKeys.trashList(params),
    queryFn: () => userGroupsApi.trash(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
  })

export const useRestoreUserGroup = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userGroupsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userGroupKeys.trash() })
      qc.invalidateQueries({ queryKey: userGroupKeys.lists() })
    },
  })
}

export const usePurgeUserGroup = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userGroupsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userGroupKeys.trash() }),
  })
}
