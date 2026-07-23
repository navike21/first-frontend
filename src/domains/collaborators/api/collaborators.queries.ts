import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import { collaboratorsApi } from './collaborators.api'
import type { CollaboratorListParams } from '../model/collaborator.types'
import type { CreateCollaboratorPayload } from '../model/collaborator.schema'

export const collaboratorKeys = {
  all: ['collaborators'] as const,
  lists: () => [...collaboratorKeys.all, 'list'] as const,
  list: (params: CollaboratorListParams) =>
    [...collaboratorKeys.lists(), params] as const,
  details: () => [...collaboratorKeys.all, 'detail'] as const,
  detail: (id: string) => [...collaboratorKeys.details(), id] as const,
  trash: () => [...collaboratorKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...collaboratorKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useCollaborators = (params: CollaboratorListParams = {}) =>
  useQuery({
    queryKey: collaboratorKeys.list(params),
    queryFn: () => collaboratorsApi.listAdmin(params),
  })

export const useCollaborator = (id: string) =>
  useQuery({
    queryKey: collaboratorKeys.detail(id),
    queryFn: () => collaboratorsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useCollaboratorsTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: collaboratorKeys.trashList(params),
    queryFn: () => collaboratorsApi.trash(params),
  })

// Users picker — used in CollaboratorForm to optionally link a real user account
interface UserPickerItem {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePictureUrl?: string
}

export const useUsersForCollaboratorPicker = () =>
  useQuery({
    queryKey: ['users', 'picker-for-collaborator'],
    queryFn: () =>
      request<ApiResponse<PaginatedData<UserPickerItem>>>({
        api: '/users?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data.items ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Full collaborators list used to exclude already-linked users from the picker
// (one collaborator per system user).
export const useLinkedUserIds = () =>
  useQuery({
    queryKey: [...collaboratorKeys.all, 'linked-user-ids'],
    queryFn: () => collaboratorsApi.listAdmin({ limit: 100 }),
    select: (res) =>
      (res.data ?? []).map((c) => c.userId).filter((id): id is string => !!id),
    staleTime: 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface CreateCollaboratorVars {
  data: CreateCollaboratorPayload
  photo?: File | null
}

export interface UpdateCollaboratorVars {
  data: Partial<CreateCollaboratorPayload>
  photo?: File | null
}

export const useCreateCollaborator = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, photo }: CreateCollaboratorVars) =>
      collaboratorsApi.create(data, photo),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: collaboratorKeys.lists() }),
  })
}

export const useUpdateCollaborator = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, photo }: UpdateCollaboratorVars) =>
      collaboratorsApi.update(id, data, photo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaboratorKeys.lists() })
      qc.invalidateQueries({ queryKey: collaboratorKeys.detail(id) })
    },
  })
}

export const useSoftDeleteCollaborator = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => collaboratorsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaboratorKeys.lists() })
      qc.invalidateQueries({ queryKey: collaboratorKeys.trash() })
    },
  })
}

export const useRestoreCollaborator = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => collaboratorsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaboratorKeys.trash() })
      qc.invalidateQueries({ queryKey: collaboratorKeys.lists() })
    },
  })
}

export const usePurgeCollaborator = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => collaboratorsApi.purge(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: collaboratorKeys.trash() }),
  })
}

export const useBulkSoftDeleteCollaborators = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => collaboratorsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaboratorKeys.lists() })
      qc.invalidateQueries({ queryKey: collaboratorKeys.trash() })
    },
  })
}

export const useBulkRestoreCollaborators = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => collaboratorsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaboratorKeys.trash() })
      qc.invalidateQueries({ queryKey: collaboratorKeys.lists() })
    },
  })
}

export const useBulkPurgeCollaborators = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => collaboratorsApi.bulkPurge(ids),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: collaboratorKeys.trash() }),
  })
}
