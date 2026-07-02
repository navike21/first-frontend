export type ClientType = 'person' | 'company'
export type ClientStatus = 'active' | 'inactive'

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

export interface ClientPrimaryContact {
  firstName: string
  lastName: string
  email: string
  phone?: string
  position?: string
}

export interface Client {
  id: string
  businessName: string
  clientType: ClientType
  documentType?: DocumentType
  documentNumber?: string
  country: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
  address?: string
  addressNumber?: string
  addressInterior?: string
  logoUrl?: string
  website?: string
  email?: string
  phone?: string
  industry?: string
  language?: string
  currency?: string
  primaryContact?: ClientPrimaryContact
  notes?: string
  status: ClientStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface ClientListParams {
  page?: number
  limit?: number
  status?: ClientStatus
  search?: string
}

export interface ClientPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
