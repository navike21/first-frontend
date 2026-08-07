import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { productCategoriesApi } from './productCategories.api'
import type { ProductCategoryListParams } from '../model/productCategory.types'
import type { CreateProductCategoryPayload } from '../model/productCategory.schema'

export const productCategoryKeys = {
  all: ['product-categories'] as const,
  lists: () => [...productCategoryKeys.all, 'list'] as const,
  list: (params: ProductCategoryListParams) =>
    [...productCategoryKeys.lists(), params] as const,
  details: () => [...productCategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productCategoryKeys.details(), id] as const,
  trash: () => [...productCategoryKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...productCategoryKeys.trash(), params] as const,
  picker: () => [...productCategoryKeys.all, 'picker'] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useProductCategories = (params: ProductCategoryListParams = {}) =>
  useQuery({
    queryKey: productCategoryKeys.list(params),
    queryFn: () => productCategoriesApi.listAdmin(params),
    placeholderData: keepPreviousData,
  })

export const useProductCategory = (id: string) =>
  useQuery({
    queryKey: productCategoryKeys.detail(id),
    queryFn: () => productCategoriesApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useProductCategoriesTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: productCategoryKeys.trashList(params),
    queryFn: () => productCategoriesApi.trash(params),
    placeholderData: keepPreviousData,
  })

// Full list (uncapped-ish) used to build the parent picker — options are
// filtered client-side to exclude the category being edited and its descendants.
export const useProductCategoriesForPicker = () =>
  useQuery({
    queryKey: productCategoryKeys.picker(),
    queryFn: () => productCategoriesApi.listAdmin({ limit: 100 }),
    select: (res) => res.data,
    staleTime: 60 * 1000,
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateProductCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProductCategoryPayload) =>
      productCategoriesApi.create(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productCategoryKeys.lists() }),
  })
}

export const useUpdateProductCategory = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateProductCategoryPayload>) =>
      productCategoriesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productCategoryKeys.lists() })
      qc.invalidateQueries({ queryKey: productCategoryKeys.detail(id) })
      qc.invalidateQueries({ queryKey: productCategoryKeys.picker() })
    },
  })
}

export const useSoftDeleteProductCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productCategoriesApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productCategoryKeys.lists() })
      qc.invalidateQueries({ queryKey: productCategoryKeys.trash() })
      qc.invalidateQueries({ queryKey: productCategoryKeys.picker() })
    },
  })
}

export const useRestoreProductCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productCategoriesApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productCategoryKeys.trash() })
      qc.invalidateQueries({ queryKey: productCategoryKeys.lists() })
      qc.invalidateQueries({ queryKey: productCategoryKeys.picker() })
    },
  })
}

export const usePurgeProductCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productCategoriesApi.purge(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productCategoryKeys.trash() }),
  })
}

export const useBulkSoftDeleteProductCategories = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productCategoriesApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productCategoryKeys.lists() })
      qc.invalidateQueries({ queryKey: productCategoryKeys.trash() })
    },
  })
}

export const useBulkRestoreProductCategories = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productCategoriesApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productCategoryKeys.trash() })
      qc.invalidateQueries({ queryKey: productCategoryKeys.lists() })
    },
  })
}

export const useBulkPurgeProductCategories = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productCategoriesApi.bulkPurge(ids),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: productCategoryKeys.trash() }),
  })
}
