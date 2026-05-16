import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@shared/api/types'
import type { Service, CreateServiceInput, UpdateServiceInput } from '../model/types'

export const serviceKeys = {
  all: ['services'] as const,
  list: (params?: PaginationParams) => ['services', 'list', params] as const,
  detail: (id: string) => ['services', id] as const,
}

export function useServices(params?: PaginationParams) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>('/services', {
        params,
      })
      return data.data
    },
  })
}

export function useService(id: string) {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Service>>(`/services/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateServiceInput) => {
      const { data } = await apiClient.post<ApiResponse<Service>>('/services', input)
      return data.data
    },
    onSuccess: (service) => {
      void qc.invalidateQueries({ queryKey: serviceKeys.all })
      notify.success(`Servicio "${service.name}" creado`)
    },
  })
}

export function useUpdateService(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateServiceInput) => {
      const { data } = await apiClient.patch<ApiResponse<Service>>(`/services/${id}`, input)
      return data.data
    },
    onSuccess: (service) => {
      qc.setQueryData(serviceKeys.detail(id), service)
      void qc.invalidateQueries({ queryKey: serviceKeys.all })
      notify.success('Servicio actualizado')
    },
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/services/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceKeys.all })
      notify.success('Servicio eliminado')
    },
  })
}
