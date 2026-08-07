import type { EcommerceSettingsTranslations } from '../types'

export const es: EcommerceSettingsTranslations = {
  page: {
    title: 'Configuración de Ecommerce',
    description:
      'Moneda, impuesto y dirección de origen usados por todo el catálogo',
  },
  form: {
    sectionGeneral: 'General',
    currency: 'Moneda (ISO 4217)',
    taxPercentage: 'Porcentaje de impuesto',
    sectionOriginAddress: 'Dirección de origen',
    originAddressHint:
      'Usada como referencia para calcular envíos por zona en el futuro.',
    country: 'País',
    region: 'Región',
    province: 'Provincia',
    address: 'Dirección',
    addressNumber: 'Número',
    addressInterior: 'Interior/Depto.',
    sectionCheckoutPolicies: 'Políticas de checkout',
    checkoutPoliciesHint:
      'Texto de términos/devoluciones, listo para cuando exista un checkout público.',
    checkoutPolicies: 'Texto de políticas',
    save: 'Guardar cambios',
  },
  toasts: {
    updated: 'Configuración actualizada',
  },
  validation: {
    currencyInvalid: 'Debe ser un código ISO 4217 de 3 letras (ej. USD)',
    taxPercentageInvalid: 'Debe estar entre 0 y 100',
  },
}
