import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { servicesApi } from './services.api'
import type { ServiceListParams } from '../model/service.types'
import type { CreateServicePayload } from '../model/service.schema'

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (params: ServiceListParams) =>
    [...serviceKeys.lists(), params] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (slug: string) => [...serviceKeys.details(), slug] as const,
  trash: () => [...serviceKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...serviceKeys.trash(), params] as const,
}

export const useServices = (
  params: ServiceListParams = {},
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => servicesApi.list(params),
    enabled: options?.enabled,
  })

export const useService = (slug: string) =>
  useQuery({
    queryKey: serviceKeys.detail(slug),
    queryFn: () => servicesApi.getBySlug(slug),
    select: (res) => res.data,
    enabled: !!slug,
  })

export const useServiceById = (id: string) =>
  useQuery({
    queryKey: [...serviceKeys.details(), 'id', id] as const,
    queryFn: () => servicesApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export interface CreateServiceVars {
  data: CreateServicePayload
  cover?: File | null
  iconFile?: File | null
  coverLibraryUrl?: string
  iconLibraryUrl?: string
}

export interface UpdateServiceVars {
  data: Partial<CreateServicePayload>
  cover?: File | null
  iconFile?: File | null
  removeCover?: boolean
  removeIcon?: boolean
  coverLibraryUrl?: string
  iconLibraryUrl?: string
}

export const useCreateService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      cover,
      iconFile,
      coverLibraryUrl,
      iconLibraryUrl,
    }: CreateServiceVars) =>
      servicesApi.create(
        data,
        cover,
        iconFile,
        coverLibraryUrl,
        iconLibraryUrl
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.lists() }),
  })
}

export const useUpdateService = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      cover,
      iconFile,
      removeCover,
      removeIcon,
      coverLibraryUrl,
      iconLibraryUrl,
    }: UpdateServiceVars) =>
      servicesApi.update(
        id,
        data,
        cover,
        iconFile,
        removeCover,
        removeIcon,
        coverLibraryUrl,
        iconLibraryUrl
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.lists() })
      qc.invalidateQueries({ queryKey: serviceKeys.details() })
    },
  })
}

export const useSoftDeleteService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => servicesApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.lists() })
      qc.invalidateQueries({ queryKey: serviceKeys.trash() })
    },
  })
}

export const useServicesTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: serviceKeys.trashList(params),
    queryFn: () => servicesApi.trash(params),
  })

export const useRestoreService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => servicesApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.trash() })
      qc.invalidateQueries({ queryKey: serviceKeys.lists() })
    },
  })
}

export const usePurgeService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => servicesApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.trash() }),
  })
}

export const useBulkSoftDeleteServices = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => servicesApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.lists() })
      qc.invalidateQueries({ queryKey: serviceKeys.trash() })
    },
  })
}

export const useBulkRestoreServices = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => servicesApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.trash() })
      qc.invalidateQueries({ queryKey: serviceKeys.lists() })
    },
  })
}

export const useBulkPurgeServices = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => servicesApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.trash() }),
  })
}
