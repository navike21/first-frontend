export type CustomerStatus = 'active' | 'inactive'
export type AddressType = 'shipping' | 'billing'

export const DOCUMENT_TYPES = [
  'DNI',
  'RUC',
  'CE',
  'NIF',
  'CIF',
  'CNPJ',
  'CPF',
  'EIN',
  'SSN',
  'VAT',
  'PASSPORT',
  'OTHER',
] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export interface CustomerAddress {
  addressId: string
  type: AddressType
  isDefault: boolean
  country?: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
  address?: string
  addressNumber?: string
  addressInterior?: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  documentType?: DocumentType
  documentNumber?: string
  addresses: CustomerAddress[]
  notes?: string
  status: CustomerStatus
  emailVerified: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface CustomerListParams {
  page?: number
  limit?: number
  search?: string
  status?: CustomerStatus
}

export interface CustomerPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
