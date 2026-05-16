import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@shared/api/types'
import type {
  PortfolioItem,
  CreatePortfolioItemInput,
  UpdatePortfolioItemInput,
} from '../model/types'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  list: (params?: PaginationParams) => ['portfolio', 'list', params] as const,
  detail: (id: string) => ['portfolio', id] as const,
}

export function usePortfolioItems(params?: PaginationParams) {
  return useQuery({
    queryKey: portfolioKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<PortfolioItem>>>(
        '/portfolio',
        { params },
      )
      return data.data
    },
  })
}

export function usePortfolioItem(id: string) {
  return useQuery({
    queryKey: portfolioKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PortfolioItem>>(`/portfolio/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreatePortfolioItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreatePortfolioItemInput) => {
      const { data } = await apiClient.post<ApiResponse<PortfolioItem>>('/portfolio', input)
      return data.data
    },
    onSuccess: (item) => {
      void qc.invalidateQueries({ queryKey: portfolioKeys.all })
      notify.success(`Proyecto "${item.title}" creado`)
    },
  })
}

export function useUpdatePortfolioItem(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdatePortfolioItemInput) => {
      const { data } = await apiClient.patch<ApiResponse<PortfolioItem>>(`/portfolio/${id}`, input)
      return data.data
    },
    onSuccess: (item) => {
      qc.setQueryData(portfolioKeys.detail(id), item)
      void qc.invalidateQueries({ queryKey: portfolioKeys.all })
      notify.success('Proyecto actualizado')
    },
  })
}

export function useDeletePortfolioItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/portfolio/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: portfolioKeys.all })
      notify.success('Proyecto eliminado')
    },
  })
}
