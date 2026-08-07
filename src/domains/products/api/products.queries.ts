import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { productsApi } from './products.api'
import type { ProductListParams } from '../model/product.types'
import type {
  CreateProductPayload,
  GalleryOrderToken,
} from '../model/product.schema'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListParams) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  trash: () => [...productKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...productKeys.trash(), params] as const,
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export const useProducts = (params: ProductListParams = {}) =>
  useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.listAdmin(params),
    placeholderData: keepPreviousData,
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useProductsTrash = (
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: productKeys.trashList(params),
    queryFn: () => productsApi.trash(params),
    placeholderData: keepPreviousData,
  })

// Product-categories picker — a local, read-only wrapper around another
// domain's admin endpoint (same cross-domain pattern portfolio uses for its
// services/clients pickers), so this domain doesn't depend on
// product-categories exporting a query hook.
interface CategoryPickerItem {
  id: string
  name: Record<string, string>
}

export const useProductCategoriesForPicker = () =>
  useQuery({
    queryKey: ['product-categories', 'picker-for-products'],
    queryFn: () =>
      request<ApiResponse<CategoryPickerItem[]>>({
        api: '/product-categories/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Shared tags picker.
interface TagPickerItem {
  id: string
  name: Record<string, string>
}

export const useTagsForProductPicker = () =>
  useQuery({
    queryKey: ['tags', 'picker-for-products'],
    queryFn: () =>
      request<ApiResponse<TagPickerItem[]>>({
        api: '/tags?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Locations picker — for the Inventory tab's per-location stock rows.
interface LocationPickerItem {
  id: string
  name: string
}

export const useLocationsForProductPicker = () =>
  useQuery({
    queryKey: ['locations', 'picker-for-products'],
    queryFn: () =>
      request<ApiResponse<LocationPickerItem[]>>({
        api: '/inventory/locations?limit=100&isActive=true',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 5 * 60 * 1000,
  })

// Ecommerce-settings picker — the single business-wide fixed currency used to
// build `Money` amounts from the form's `PriceInput` (major-units decimal).
interface EcommerceSettingsPickerData {
  currency: string
}

export const useCurrencyForProductPicker = () =>
  useQuery({
    queryKey: ['ecommerce-settings', 'picker-for-products'],
    queryFn: () =>
      request<ApiResponse<EcommerceSettingsPickerData>>({
        api: '/ecommerce-settings',
        method: 'GET',
      }),
    select: (res) => res.data?.currency ?? 'USD',
    staleTime: 5 * 60 * 1000,
  })

interface StockByLocation {
  locationId: string
  locationName: string
  variantId: string | null
  quantity: number
}
interface StockSummary {
  productId: string
  total: number
  byLocation: StockByLocation[]
}

export const useProductStock = (productId: string) =>
  useQuery({
    queryKey: ['inventory', 'stock', productId],
    queryFn: () =>
      request<ApiResponse<StockSummary>>({
        api: `/inventory/stock/${productId}`,
        method: 'GET',
      }),
    select: (res) => res.data,
    enabled: !!productId,
  })

export const useAdjustProductStock = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      productId: string
      variantId?: string
      locationId: string
      quantity: number
    }) =>
      request<ApiResponse<{ quantity: number }>, typeof data>({
        api: '/inventory/stock',
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({
        queryKey: ['inventory', 'stock', variables.productId],
      })
    },
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface CreateProductVars {
  data: CreateProductPayload
  galleryFiles?: File[]
}

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, galleryFiles }: CreateProductVars) =>
      productsApi.create(data, galleryFiles),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export interface UpdateProductVars {
  data: Partial<CreateProductPayload>
  galleryFiles?: File[]
  galleryOrder?: GalleryOrderToken[]
}

export const useUpdateProduct = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, galleryFiles, galleryOrder }: UpdateProductVars) =>
      productsApi.update(id, data, galleryFiles, galleryOrder),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() })
      qc.invalidateQueries({ queryKey: productKeys.detail(id) })
    },
  })
}

export const useSoftDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() })
      qc.invalidateQueries({ queryKey: productKeys.trash() })
    },
  })
}

export const useRestoreProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.trash() })
      qc.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export const usePurgeProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.trash() }),
  })
}

export const useBulkSoftDeleteProducts = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() })
      qc.invalidateQueries({ queryKey: productKeys.trash() })
    },
  })
}

export const useBulkRestoreProducts = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.trash() })
      qc.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export const useBulkPurgeProducts = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => productsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.trash() }),
  })
}
