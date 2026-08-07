export type LocationType = 'warehouse' | 'store'

export interface LocationAddress {
  country?: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
  address?: string
  addressNumber?: string
  addressInterior?: string
}

export interface Location {
  id: string
  name: string
  type: LocationType
  address?: LocationAddress
  fulfillsOnline: boolean
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface LocationListParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface LocationPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface StockByLocation {
  locationId: string
  locationName: string
  variantId: string | null
  quantity: number
}

export interface StockSummary {
  productId: string
  total: number
  byLocation: StockByLocation[]
}
