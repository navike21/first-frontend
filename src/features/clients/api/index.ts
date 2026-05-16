import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@shared/api/types'
import type { Client, CreateClientInput, UpdateClientInput } from '../model/types'

export const clientKeys = {
  all: ['clients'] as const,
  list: (params?: PaginationParams) => ['clients', 'list', params] as const,
  detail: (id: string) => ['clients', id] as const,
}

export function useClients(params?: PaginationParams) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Client>>>('/clients', {
        params,
      })
      return data.data
    },
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Client>>(`/clients/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateClientInput) => {
      const { data } = await apiClient.post<ApiResponse<Client>>('/clients', input)
      return data.data
    },
    onSuccess: (client) => {
      void qc.invalidateQueries({ queryKey: clientKeys.all })
      notify.success(`Cliente "${client.name}" creado`)
    },
  })
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateClientInput) => {
      const { data } = await apiClient.patch<ApiResponse<Client>>(`/clients/${id}`, input)
      return data.data
    },
    onSuccess: (client) => {
      qc.setQueryData(clientKeys.detail(id), client)
      void qc.invalidateQueries({ queryKey: clientKeys.all })
      notify.success('Cliente actualizado')
    },
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/clients/${id}`)
      return id
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: clientKeys.all })
      notify.success('Cliente eliminado')
    },
  })
}
