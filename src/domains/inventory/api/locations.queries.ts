import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { locationsApi } from './locations.api'
import type { LocationListParams } from '../model/location.types'
import type { CreateLocationPayload } from '../model/location.schema'

export const locationKeys = {
  all: ['locations'] as const,
  lists: () => [...locationKeys.all, 'list'] as const,
  list: (params: LocationListParams) =>
    [...locationKeys.lists(), params] as const,
  details: () => [...locationKeys.all, 'detail'] as const,
  detail: (id: string) => [...locationKeys.details(), id] as const,
  trash: () => [...locationKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...locationKeys.trash(), params] as const,
  picker: () => [...locationKeys.all, 'picker'] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useLocations = (params: LocationListParams = {}) =>
  useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => locationsApi.list(params),
    placeholderData: keepPreviousData,
  })

export const useLocation = (id: string) =>
  useQuery({
    queryKey: locationKeys.detail(id),
    queryFn: () => locationsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useLocationsTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: locationKeys.trashList(params),
    queryFn: () => locationsApi.trash(params),
    placeholderData: keepPreviousData,
  })

// Full active list — used to build the location picker on the Stock page.
export const useLocationsForPicker = () =>
  useQuery({
    queryKey: locationKeys.picker(),
    queryFn: () => locationsApi.list({ limit: 100, isActive: true }),
    select: (res) => res.data,
    staleTime: 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateLocation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLocationPayload) => locationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: locationKeys.lists() }),
  })
}

export const useUpdateLocation = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateLocationPayload>) =>
      locationsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: locationKeys.lists() })
      qc.invalidateQueries({ queryKey: locationKeys.detail(id) })
      qc.invalidateQueries({ queryKey: locationKeys.picker() })
    },
  })
}

export const useSoftDeleteLocation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => locationsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: locationKeys.lists() })
      qc.invalidateQueries({ queryKey: locationKeys.trash() })
      qc.invalidateQueries({ queryKey: locationKeys.picker() })
    },
  })
}

export const useRestoreLocation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => locationsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: locationKeys.trash() })
      qc.invalidateQueries({ queryKey: locationKeys.lists() })
      qc.invalidateQueries({ queryKey: locationKeys.picker() })
    },
  })
}

export const usePurgeLocation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => locationsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: locationKeys.trash() }),
  })
}

export const useBulkSoftDeleteLocations = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => locationsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: locationKeys.lists() })
      qc.invalidateQueries({ queryKey: locationKeys.trash() })
    },
  })
}

export const useBulkRestoreLocations = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => locationsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: locationKeys.trash() })
      qc.invalidateQueries({ queryKey: locationKeys.lists() })
    },
  })
}

export const useBulkPurgeLocations = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => locationsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: locationKeys.trash() }),
  })
}
