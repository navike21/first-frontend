import type { EcommerceSettingsTranslations } from '../types'

export const en: EcommerceSettingsTranslations = {
  page: {
    title: 'Ecommerce Settings',
    description: 'Currency, tax and origin address used across the catalog',
  },
  form: {
    sectionGeneral: 'General',
    currency: 'Currency (ISO 4217)',
    taxPercentage: 'Tax percentage',
    sectionOriginAddress: 'Origin address',
    originAddressHint:
      'Used as a reference for future zone-based shipping calculations.',
    country: 'Country',
    region: 'Region',
    province: 'Province',
    address: 'Address',
    addressNumber: 'Number',
    addressInterior: 'Interior/Apt.',
    sectionCheckoutPolicies: 'Checkout policies',
    checkoutPoliciesHint:
      'Terms/return policy text, ready for when a public checkout exists.',
    checkoutPolicies: 'Policy text',
    save: 'Save changes',
  },
  toasts: {
    updated: 'Settings updated',
  },
  validation: {
    currencyInvalid: 'Must be a 3-letter ISO 4217 code (e.g. USD)',
    taxPercentageInvalid: 'Must be between 0 and 100',
  },
}
