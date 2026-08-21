import { z } from 'zod'
import type { EcommerceSettingsTranslations } from '../i18n/types'
import type { EcommerceSettingsAddress } from './ecommerceSettings.types'

type V = EcommerceSettingsTranslations['validation']

const optional = z.string().trim().optional().or(z.literal(''))

export function createEcommerceSettingsSchema(v: V) {
  return z.object({
    currency: z
      .string()
      .trim()
      .length(3, v.currencyInvalid)
      .transform((c) => c.toUpperCase()),
    taxPercentage: z.coerce.number().min(0).max(100, v.taxPercentageInvalid),
    country: optional,
    ubigeoCode: optional,
    region: optional,
    province: optional,
    district: optional,
    address: optional,
    addressNumber: optional,
    addressInterior: optional,
  })
}

export type EcommerceSettingsFormData = z.infer<
  ReturnType<typeof createEcommerceSettingsSchema>
>

export interface EcommerceSettingsUpdatePayload {
  currency: string
  taxPercentage: number
  storeOriginAddress: EcommerceSettingsAddress
}

function stripEmpty<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined)
  ) as T
}

export function toEcommerceSettingsPayload(
  data: EcommerceSettingsFormData
): EcommerceSettingsUpdatePayload {
  const {
    currency,
    taxPercentage,
    country,
    ubigeoCode,
    region,
    province,
    district,
    address,
    addressNumber,
    addressInterior,
  } = data

  return {
    currency,
    taxPercentage,
    storeOriginAddress: stripEmpty({
      country,
      ubigeoCode,
      region,
      province,
      district,
      address,
      addressNumber,
      addressInterior,
    }),
  }
}
