import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@shared/api/types'
import type { Subscriber, CreateSubscriberInput } from '../model/types'

export const subscriberKeys = {
  all: ['subscribers'] as const,
  list: (params?: PaginationParams) => ['subscribers', 'list', params] as const,
}

export function useSubscribers(params?: PaginationParams) {
  return useQuery({
    queryKey: subscriberKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Subscriber>>>(
        '/subscribers',
        { params },
      )
      return data.data
    },
  })
}

export function useCreateSubscriber() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateSubscriberInput) => {
      const { data } = await apiClient.post<ApiResponse<Subscriber>>('/subscribers', input)
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: subscriberKeys.all })
      notify.success('Suscriptor añadido')
    },
  })
}

export function useDeleteSubscriber() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/subscribers/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: subscriberKeys.all })
      notify.success('Suscriptor eliminado')
    },
  })
}
