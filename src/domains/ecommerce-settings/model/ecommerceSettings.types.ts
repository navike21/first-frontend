import type { Language } from '@/shared/i18n'

export type EcommerceLocalizedString = Record<Language, string>

export interface EcommerceSettingsAddress {
  country?: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
  address?: string
  addressNumber?: string
  addressInterior?: string
}

export interface EcommerceSettings {
  id: string
  currency: string
  taxPercentage: number
  storeOriginAddress: EcommerceSettingsAddress
  checkoutPolicies: EcommerceLocalizedString
  createdAt?: string
  updatedAt?: string
}
