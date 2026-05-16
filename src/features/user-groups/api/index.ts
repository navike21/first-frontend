import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@shared/api/types'
import type { UserGroup, CreateUserGroupInput, UpdateUserGroupInput } from '../model/types'

export const userGroupKeys = {
  all: ['user-groups'] as const,
  list: (params?: PaginationParams) => ['user-groups', 'list', params] as const,
  detail: (id: string) => ['user-groups', id] as const,
}

export function useUserGroups(params?: PaginationParams) {
  return useQuery({
    queryKey: userGroupKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<UserGroup>>>(
        '/user-groups',
        { params },
      )
      return data.data
    },
  })
}

export function useUserGroup(id: string) {
  return useQuery({
    queryKey: userGroupKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<UserGroup>>(`/user-groups/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateUserGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateUserGroupInput) => {
      const { data } = await apiClient.post<ApiResponse<UserGroup>>('/user-groups', input)
      return data.data
    },
    onSuccess: (group) => {
      void qc.invalidateQueries({ queryKey: userGroupKeys.all })
      notify.success(`Grupo "${group.name}" creado`)
    },
  })
}

export function useUpdateUserGroup(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateUserGroupInput) => {
      const { data } = await apiClient.patch<ApiResponse<UserGroup>>(`/user-groups/${id}`, input)
      return data.data
    },
    onSuccess: (group) => {
      qc.setQueryData(userGroupKeys.detail(id), group)
      void qc.invalidateQueries({ queryKey: userGroupKeys.all })
      notify.success(`Grupo "${group.name}" actualizado`)
    },
  })
}

export function useDeleteUserGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/user-groups/${id}`)
      return id
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: userGroupKeys.all })
      notify.success('Grupo eliminado')
    },
  })
}
