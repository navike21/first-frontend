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
