import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagsApi } from './tags.api'
import type { TagListParams } from '../model/tag.types'
import type { CreateTagPayload } from '../model/tag.schema'

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (params: TagListParams) => [...tagKeys.lists(), params] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
  trash: () => [...tagKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...tagKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useTags = (params: TagListParams = {}) =>
  useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () => tagsApi.listAdmin(params),
  })

export const useTag = (id: string) =>
  useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useTagsTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: tagKeys.trashList(params),
    queryFn: () => tagsApi.trash(params),
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateTag = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTagPayload) => tagsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.lists() }),
  })
}

export const useUpdateTag = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateTagPayload>) => tagsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.lists() })
      qc.invalidateQueries({ queryKey: tagKeys.detail(id) })
    },
  })
}

export const useSoftDeleteTag = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tagsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.lists() })
      qc.invalidateQueries({ queryKey: tagKeys.trash() })
    },
  })
}

export const useRestoreTag = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tagsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.trash() })
      qc.invalidateQueries({ queryKey: tagKeys.lists() })
    },
  })
}

export const usePurgeTag = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tagsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.trash() }),
  })
}

export const useBulkSoftDeleteTags = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => tagsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.lists() })
      qc.invalidateQueries({ queryKey: tagKeys.trash() })
    },
  })
}

export const useBulkRestoreTags = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => tagsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.trash() })
      qc.invalidateQueries({ queryKey: tagKeys.lists() })
    },
  })
}

export const useBulkPurgeTags = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => tagsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.trash() }),
  })
}
