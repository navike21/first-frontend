import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsApi } from './clients.api'
import type { ClientListParams } from '../model/client.types'
import type {
  CreateClientFormData,
  UpdateClientFormData,
} from '../model/client.schema'

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params: ClientListParams) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  trash: () => [...clientKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...clientKeys.trash(), params] as const,
}

export const useClients = (
  params: ClientListParams = {},
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => clientsApi.list(params),
    enabled: options?.enabled,
  })

export const useClient = (id: string) =>
  useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export interface CreateClientVars {
  data: CreateClientFormData
  logo?: File | null
  /** Already-hosted URL picked from the media library (no upload needed). */
  logoLibraryUrl?: string
}

export interface UpdateClientVars {
  data: UpdateClientFormData
  logo?: File | null
  /** When true (and no new logo), clears the existing logo. */
  removeLogo?: boolean
  /** Already-hosted URL picked from the media library (no upload needed). */
  logoLibraryUrl?: string
}

export const useCreateClient = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, logo, logoLibraryUrl }: CreateClientVars) =>
      clientsApi.create(data, logo, logoLibraryUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientKeys.lists() }),
  })
}

export const useUpdateClient = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      logo,
      removeLogo,
      logoLibraryUrl,
    }: UpdateClientVars) =>
      clientsApi.update(id, data, logo, removeLogo, logoLibraryUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.lists() })
      qc.invalidateQueries({ queryKey: clientKeys.detail(id) })
    },
  })
}

export const useSoftDeleteClient = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.lists() })
      qc.invalidateQueries({ queryKey: clientKeys.trash() })
    },
  })
}

export const useClientsTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: clientKeys.trashList(params),
    queryFn: () => clientsApi.trash(params),
  })

export const useRestoreClient = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.trash() })
      qc.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

export const usePurgeClient = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => clientsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientKeys.trash() }),
  })
}

export const useBulkSoftDeleteClients = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => clientsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.lists() })
      qc.invalidateQueries({ queryKey: clientKeys.trash() })
    },
  })
}

export const useBulkRestoreClients = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => clientsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.trash() })
      qc.invalidateQueries({ queryKey: clientKeys.lists() })
    },
  })
}

export const useBulkPurgeClients = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => clientsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientKeys.trash() }),
  })
}
