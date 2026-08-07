import { z } from 'zod'
import type { CustomerTranslations } from '../i18n/types'
import { DOCUMENT_TYPES } from './customer.types'
import type { AddressType } from './customer.types'

type V = CustomerTranslations['validation']

const optional = z.string().trim().optional().or(z.literal(''))

const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  isDefault: z.boolean().default(false),
  country: optional,
  ubigeoCode: optional,
  region: optional,
  province: optional,
  district: optional,
  address: optional,
  addressNumber: optional,
  addressInterior: optional,
})

export function createCustomerSchema(v: V) {
  return z.object({
    firstName: z.string().trim().min(1, v.firstNameRequired).max(100),
    lastName: z.string().trim().min(1, v.lastNameRequired).max(100),
    email: z.email(v.emailInvalid).trim(),
    phone: optional,
    documentType: z.enum(DOCUMENT_TYPES).optional().or(z.literal('')),
    documentNumber: z
      .string()
      .trim()
      .max(50, v.documentNumberMax)
      .optional()
      .or(z.literal('')),
    addresses: z.array(addressSchema).default([]),
    notes: z.string().trim().max(2000, v.notesMax).optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export type CustomerFormData = z.infer<ReturnType<typeof createCustomerSchema>>
export type CustomerAddressFormData = CustomerFormData['addresses'][number]

export interface CreateCustomerAddressPayload {
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

export interface CreateCustomerPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  documentType?: string
  documentNumber?: string
  addresses: CreateCustomerAddressPayload[]
  notes?: string
  status: 'active' | 'inactive'
}

function stripEmpty<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined)
  ) as T
}

export function toCustomerPayload(
  data: CustomerFormData
): CreateCustomerPayload {
  const { addresses, ...rest } = data
  return {
    ...stripEmpty(rest),
    addresses: addresses.map(
      (a) => stripEmpty(a) as CreateCustomerAddressPayload
    ),
  } as CreateCustomerPayload
}
