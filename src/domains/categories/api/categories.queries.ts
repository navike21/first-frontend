import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { categoriesApi } from './categories.api'
import type { CategoryListParams } from '../model/category.types'
import type { CreateCategoryPayload } from '../model/category.schema'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params: CategoryListParams) =>
    [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  trash: () => [...categoryKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...categoryKeys.trash(), params] as const,
  picker: () => [...categoryKeys.all, 'picker'] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useCategories = (params: CategoryListParams = {}) =>
  useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoriesApi.listAdmin(params),
    placeholderData: keepPreviousData,
  })

export const useCategory = (id: string) =>
  useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useCategoriesTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: categoryKeys.trashList(params),
    queryFn: () => categoriesApi.trash(params),
    placeholderData: keepPreviousData,
  })

// Full list (uncapped-ish) used to build the parent picker — options are
// filtered client-side to exclude the category being edited and its descendants.
export const useCategoriesForPicker = () =>
  useQuery({
    queryKey: categoryKeys.picker(),
    queryFn: () => categoriesApi.listAdmin({ limit: 100 }),
    select: (res) => res.data,
    staleTime: 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCategoryPayload) => categoriesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.lists() }),
  })
}

export const useUpdateCategory = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateCategoryPayload>) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.lists() })
      qc.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      qc.invalidateQueries({ queryKey: categoryKeys.picker() })
    },
  })
}

export const useSoftDeleteCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.lists() })
      qc.invalidateQueries({ queryKey: categoryKeys.trash() })
      qc.invalidateQueries({ queryKey: categoryKeys.picker() })
    },
  })
}

export const useRestoreCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.trash() })
      qc.invalidateQueries({ queryKey: categoryKeys.lists() })
      qc.invalidateQueries({ queryKey: categoryKeys.picker() })
    },
  })
}

export const usePurgeCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.trash() }),
  })
}

export const useBulkSoftDeleteCategories = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => categoriesApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.lists() })
      qc.invalidateQueries({ queryKey: categoryKeys.trash() })
    },
  })
}

export const useBulkRestoreCategories = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => categoriesApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.trash() })
      qc.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

export const useBulkPurgeCategories = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => categoriesApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.trash() }),
  })
}
