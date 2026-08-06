import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { blogApi, type BlogImageFiles } from './blog.api'
import type { BlogListParams } from '../model/blog.types'
import type { CreateBlogPostPayload } from '../model/blog.schema'

export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (params: BlogListParams) => [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  trash: () => [...blogKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...blogKeys.trash(), params] as const,
  picker: () => [...blogKeys.all, 'picker'] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const usePostList = (params: BlogListParams = {}) =>
  useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogApi.listAdmin(params),
    placeholderData: keepPreviousData,
  })

export const usePostById = (id: string) =>
  useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const usePostTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: blogKeys.trashList(params),
    queryFn: () => blogApi.trash(params),
    placeholderData: keepPreviousData,
  })

// Categories picker — used in BlogPostForm's Organization step
interface CategoryPickerItem {
  id: string
  name: Record<string, string>
}

export const useCategoriesForBlogPicker = () =>
  useQuery({
    queryKey: ['categories', 'picker-for-blog'],
    queryFn: () =>
      request<ApiResponse<CategoryPickerItem[]>>({
        api: '/categories/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Tags picker — used in BlogPostForm's Organization step
interface TagPickerItem {
  id: string
  name: Record<string, string>
}

export const useTagsForBlogPicker = () =>
  useQuery({
    queryKey: ['tags', 'picker-for-blog'],
    queryFn: () =>
      request<ApiResponse<TagPickerItem[]>>({
        api: '/tags/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Collaborators picker — used in BlogPostForm's Organization step to select an author
interface CollaboratorPickerItem {
  id: string
  name: string
  role?: string
  photoUrl?: string
}

export const useCollaboratorsForBlogPicker = () =>
  useQuery({
    queryKey: ['collaborators', 'picker-for-blog'],
    queryFn: () =>
      request<ApiResponse<CollaboratorPickerItem[]>>({
        api: '/collaborators/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface CreatePostVars {
  data: CreateBlogPostPayload
  files?: BlogImageFiles
  coverLibraryUrl?: string
}

export interface UpdatePostVars {
  data: Partial<CreateBlogPostPayload>
  files?: BlogImageFiles
  removeCover?: boolean
  coverLibraryUrl?: string
}

export const useCreatePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, files, coverLibraryUrl }: CreatePostVars) =>
      blogApi.create(data, files, coverLibraryUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.lists() }),
  })
}

export const useUpdatePost = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      files,
      removeCover,
      coverLibraryUrl,
    }: UpdatePostVars) =>
      blogApi.update(id, data, files, removeCover, coverLibraryUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: blogKeys.lists() })
      qc.invalidateQueries({ queryKey: blogKeys.details() })
    },
  })
}

export const useSoftDeletePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: blogKeys.lists() })
      qc.invalidateQueries({ queryKey: blogKeys.trash() })
    },
  })
}

export const useRestorePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: blogKeys.trash() })
      qc.invalidateQueries({ queryKey: blogKeys.lists() })
    },
  })
}

export const usePurgePost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.trash() }),
  })
}

export const useBulkSoftDeletePosts = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => blogApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: blogKeys.lists() })
      qc.invalidateQueries({ queryKey: blogKeys.trash() })
    },
  })
}

export const useBulkRestorePosts = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => blogApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: blogKeys.trash() })
      qc.invalidateQueries({ queryKey: blogKeys.lists() })
    },
  })
}

export const useBulkPurgePosts = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => blogApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.trash() }),
  })
}
