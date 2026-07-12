import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { pagesApi } from './pages.api'
import type { BuilderSection, PageListParams } from '../model/page.types'
import type { CreatePagePayload } from '../model/page.schema'

export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: (params: PageListParams) => [...pageKeys.lists(), params] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
  trash: () => [...pageKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) => [...pageKeys.trash(), params] as const,
  picker: () => [...pageKeys.all, 'picker'] as const,
  revisions: (id: string) => [...pageKeys.all, 'revisions', id] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const usePages = (params: PageListParams = {}) =>
  useQuery({
    queryKey: pageKeys.list(params),
    queryFn: () => pagesApi.listAdmin(params),
  })

export const usePage = (id: string) =>
  useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: () => pagesApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const usePagesTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: pageKeys.trashList(params),
    queryFn: () => pagesApi.trash(params),
  })

// Full list used to build the parent-page picker and hierarchy/breadcrumb
// display — options are filtered client-side to exclude the page being
// edited and its descendants (cycle prevention mirrors the backend check).
export const usePagesForPicker = () =>
  useQuery({
    queryKey: pageKeys.picker(),
    queryFn: () => pagesApi.listAdmin({ limit: 100 }),
    select: (res) => res.data,
    staleTime: 60 * 1000,
  })

export const usePageRevisions = (pageId: string) =>
  useQuery({
    queryKey: pageKeys.revisions(pageId),
    queryFn: () => pagesApi.listRevisions(pageId),
    select: (res) => res.data,
    enabled: !!pageId,
  })

// Categories picker — used in PageForm's Organization step
interface CategoryPickerItem {
  id: string
  name: Record<string, string>
}

export const useCategoriesForPagePicker = () =>
  useQuery({
    queryKey: ['categories', 'picker-for-page'],
    queryFn: () =>
      request<ApiResponse<CategoryPickerItem[]>>({ api: '/categories/admin?limit=100', method: 'GET' }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Tags picker — used in PageForm's Organization step
interface TagPickerItem {
  id: string
  name: Record<string, string>
}

export const useTagsForPagePicker = () =>
  useQuery({
    queryKey: ['tags', 'picker-for-page'],
    queryFn: () => request<ApiResponse<TagPickerItem[]>>({ api: '/tags/admin?limit=100', method: 'GET' }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Users picker — used to resolve createdBy/updatedBy to a readable name
interface UserPickerItem {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePictureUrl?: string
}

export const useUsersForPagePicker = () =>
  useQuery({
    queryKey: ['users', 'picker-for-page'],
    queryFn: () => request<ApiResponse<{ items: UserPickerItem[] }>>({ api: '/users?limit=100', method: 'GET' }),
    select: (res) => res.data.items ?? [],
    staleTime: 5 * 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface CreatePageVars {
  data: CreatePagePayload
  cover?: File | null
  ogImage?: File | null
  coverLibraryUrl?: string
}

export interface UpdatePageVars {
  data: Partial<CreatePagePayload>
  cover?: File | null
  ogImage?: File | null
  removeCover?: boolean
  coverLibraryUrl?: string
}

export const useCreatePage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, cover, ogImage, coverLibraryUrl }: CreatePageVars) =>
      pagesApi.create(data, { cover, ogImage }, coverLibraryUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
      qc.invalidateQueries({ queryKey: pageKeys.picker() })
    },
  })
}

export const useUpdatePage = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, cover, ogImage, removeCover, coverLibraryUrl }: UpdatePageVars) =>
      pagesApi.update(id, data, { cover, ogImage }, removeCover, coverLibraryUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
      qc.invalidateQueries({ queryKey: pageKeys.detail(id) })
      qc.invalidateQueries({ queryKey: pageKeys.picker() })
      qc.invalidateQueries({ queryKey: pageKeys.revisions(id) })
    },
  })
}

export const useSoftDeletePage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pagesApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
      qc.invalidateQueries({ queryKey: pageKeys.trash() })
      qc.invalidateQueries({ queryKey: pageKeys.picker() })
    },
  })
}

export const useRestorePage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pagesApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.trash() })
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
      qc.invalidateQueries({ queryKey: pageKeys.picker() })
    },
  })
}

export const usePurgePage = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pagesApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: pageKeys.trash() }),
  })
}

export const useBulkSoftDeletePages = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => pagesApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
      qc.invalidateQueries({ queryKey: pageKeys.trash() })
    },
  })
}

export const useBulkRestorePages = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => pagesApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.trash() })
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
    },
  })
}

export const useBulkPurgePages = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => pagesApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: pageKeys.trash() }),
  })
}

export const useReplaceSections = (pageId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sections: BuilderSection[]) => pagesApi.replaceSections(pageId, sections),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.detail(pageId) })
      qc.invalidateQueries({ queryKey: pageKeys.revisions(pageId) })
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
    },
  })
}

export const useRestorePageRevision = (pageId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (revisionId: string) => pagesApi.restoreRevision(pageId, revisionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageKeys.detail(pageId) })
      qc.invalidateQueries({ queryKey: pageKeys.revisions(pageId) })
      qc.invalidateQueries({ queryKey: pageKeys.lists() })
    },
  })
}
