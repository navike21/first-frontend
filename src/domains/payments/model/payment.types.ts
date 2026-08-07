export type PaymentProviderKey = 'culqi' | 'mercadopago' | 'stripe' | 'manual'

export interface PaymentProviderField {
  key: string
  label: string
  type: 'text' | 'password'
  required: boolean
}

export interface PaymentProviderConfig {
  provider: PaymentProviderKey
  label: string
  fields: PaymentProviderField[]
  enabled: boolean
  isDefault: boolean
  config: Record<string, string>
}

export interface PaymentMethod {
  id: string
  customerId: string
  provider: PaymentProviderKey
  providerToken: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface PaymentMethodListParams {
  page?: number
  limit?: number
  customerId?: string
  provider?: PaymentProviderKey
}

export interface PaymentMethodPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
