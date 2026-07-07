import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { portfolioApi } from './portfolio.api'
import type { PortfolioListParams } from '../model/portfolio.types'
import type { CreatePortfolioPayload } from '../model/portfolio.schema'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (params: PortfolioListParams) => [...portfolioKeys.lists(), params] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (slug: string) => [...portfolioKeys.details(), slug] as const,
  trash: () => [...portfolioKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) => [...portfolioKeys.trash(), params] as const,
  picker: () => [...portfolioKeys.all, 'picker'] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const usePortfolioList = (params: PortfolioListParams = {}) =>
  useQuery({
    queryKey: portfolioKeys.list(params),
    queryFn: () => portfolioApi.listAdmin(params),
  })

export const usePortfolioBySlug = (slug: string) =>
  useQuery({
    queryKey: portfolioKeys.detail(slug),
    queryFn: () => portfolioApi.getBySlug(slug),
    select: (res) => res.data,
    enabled: !!slug,
  })

export const usePortfolioTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: portfolioKeys.trashList(params),
    queryFn: () => portfolioApi.trash(params),
  })

// Services picker — used in PortfolioForm to select associated services
interface ServicePickerItem {
  id: string
  name: Record<string, string>
}

export const useServicesForPortfolioPicker = () =>
  useQuery({
    queryKey: ['services', 'picker-for-portfolio'],
    queryFn: () =>
      request<ApiResponse<ServicePickerItem[]>>({ api: '/services/admin?limit=100', method: 'GET' }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Clients picker — used in PortfolioForm to select an associated client
interface ClientPickerItem {
  id: string
  businessName: string
}

export const useClientsForPortfolioPicker = () =>
  useQuery({
    queryKey: ['clients', 'picker-for-portfolio'],
    queryFn: () =>
      request<ApiResponse<ClientPickerItem[]>>({ api: '/clients?limit=100', method: 'GET' }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface CreatePortfolioVars {
  data: CreatePortfolioPayload
  cover?: File | null
}

export interface UpdatePortfolioVars {
  data: Partial<CreatePortfolioPayload>
  cover?: File | null
  removeCover?: boolean
}

export const useCreatePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, cover }: CreatePortfolioVars) => portfolioApi.create(data, cover),
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.lists() }),
  })
}

export const useUpdatePortfolio = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, cover, removeCover }: UpdatePortfolioVars) =>
      portfolioApi.update(id, data, cover, removeCover),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.lists() })
      qc.invalidateQueries({ queryKey: portfolioKeys.details() })
    },
  })
}

export const useSoftDeletePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => portfolioApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.lists() })
      qc.invalidateQueries({ queryKey: portfolioKeys.trash() })
    },
  })
}

export const useRestorePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => portfolioApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.trash() })
      qc.invalidateQueries({ queryKey: portfolioKeys.lists() })
    },
  })
}

export const usePurgePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => portfolioApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.trash() }),
  })
}

export const useBulkSoftDeletePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => portfolioApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.lists() })
      qc.invalidateQueries({ queryKey: portfolioKeys.trash() })
    },
  })
}

export const useBulkRestorePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => portfolioApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.trash() })
      qc.invalidateQueries({ queryKey: portfolioKeys.lists() })
    },
  })
}

export const useBulkPurgePortfolio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => portfolioApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.trash() }),
  })
}
