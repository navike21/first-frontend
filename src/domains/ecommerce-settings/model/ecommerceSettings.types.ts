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
  createdAt?: string
  updatedAt?: string
}
