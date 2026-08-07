import { z } from 'zod'
import type { PaymentsTranslations } from '../i18n/types'
import type { PaymentProviderKey } from './payment.types'

type V = PaymentsTranslations['validation']

export const PAYMENT_PROVIDER_KEYS = ['culqi', 'mercadopago', 'stripe', 'manual'] as const

const monthRegex = /^(?:[1-9]|1[0-2])$/
const yearRegex = /^\d{4}$/

export function createPaymentMethodSchema(v: V) {
  return z.object({
    customerId: z.string().trim().min(1, v.required),
    provider: z.enum(PAYMENT_PROVIDER_KEYS),
    providerToken: z.string().trim().min(1, v.required),
    brand: z.string().trim().min(1, v.required),
    last4: z
      .string()
      .trim()
      .regex(/^\d{4}$/, v.last4Invalid),
    expiryMonth: z.string().trim().regex(monthRegex, v.expiryInvalid),
    expiryYear: z.string().trim().regex(yearRegex, v.expiryInvalid),
    isDefault: z.boolean().default(false),
  })
}

export interface PaymentMethodFormData {
  customerId: string
  provider: PaymentProviderKey
  providerToken: string
  brand: string
  last4: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
}

export interface CreatePaymentMethodPayload {
  customerId: string
  provider: PaymentProviderKey
  providerToken: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

export function toPaymentMethodPayload(
  data: PaymentMethodFormData
): CreatePaymentMethodPayload {
  return {
    customerId: data.customerId,
    provider: data.provider,
    providerToken: data.providerToken.trim(),
    brand: data.brand.trim(),
    last4: data.last4.trim(),
    expiryMonth: Number.parseInt(data.expiryMonth, 10),
    expiryYear: Number.parseInt(data.expiryYear, 10),
    isDefault: data.isDefault,
  }
}
