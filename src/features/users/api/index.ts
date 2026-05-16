import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@shared/api/types'
import type { User, CreateUserInput, UpdateUserInput } from '../model/types'

export const userKeys = {
  all: ['users'] as const,
  list: (params?: PaginationParams) => ['users', 'list', params] as const,
  detail: (id: string) => ['users', id] as const,
}

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', {
        params,
      })
      return data.data
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const { data } = await apiClient.post<ApiResponse<User>>('/users', input)
      return data.data
    },
    onSuccess: (user) => {
      void qc.invalidateQueries({ queryKey: userKeys.all })
      notify.success(`Usuario ${user.firstName} ${user.lastName} creado`)
    },
  })
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, input)
      return data.data
    },
    onSuccess: (user) => {
      qc.setQueryData(userKeys.detail(id), user)
      void qc.invalidateQueries({ queryKey: userKeys.all })
      notify.success('Usuario actualizado')
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`)
      return id
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: userKeys.all })
      notify.success('Usuario eliminado')
    },
  })
}
