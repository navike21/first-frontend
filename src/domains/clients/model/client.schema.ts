import { z } from 'zod'
import type { ClientsTranslations } from '../i18n/types'
import { DOCUMENT_TYPES } from './client.types'

type V = ClientsTranslations['validation']

const optional = z.string().trim().optional().or(z.literal(''))

export function createClientSchema(v: V) {
  return z
    .object({
      businessName: z
        .string()
        .trim()
        .min(2, v.businessNameMin)
        .max(200, v.businessNameMax),
      clientType: z.enum(['person', 'company'], { message: v.required }),
      documentType: z.enum(DOCUMENT_TYPES).optional().or(z.literal('')),
      documentNumber: z
        .string()
        .trim()
        .max(50, v.documentNumberMax)
        .optional()
        .or(z.literal('')),
      country: z
        .string()
        .trim()
        .length(2, v.countryLength)
        .transform((c) => c.toUpperCase()),
      ubigeoCode: optional,
      region: optional,
      province: optional,
      district: optional,
      address: optional,
      website: z.url(v.urlInvalid).optional().or(z.literal('')),
      email: z.email(v.emailInvalid).optional().or(z.literal('')),
      phone: optional,
      industry: optional,
      language: optional,
      currency: z
        .string()
        .trim()
        .length(3, v.currencyLength)
        .transform((c) => c.toUpperCase())
        .optional()
        .or(z.literal('')),
      primaryContact: z
        .object({
          firstName: optional,
          lastName: optional,
          email: z.email(v.contactEmailInvalid).optional().or(z.literal('')),
          phone: optional,
          position: optional,
        })
        .optional(),
      notes: z.string().trim().max(2000, v.notesMax).optional().or(z.literal('')),
      status: z.enum(['active', 'inactive']).default('active'),
    })
    .superRefine((d, ctx) => {
      // Contact is optional as a whole, but once the user starts filling it the
      // core identity fields (name + email) become required.
      const c = d.primaryContact
      if (!c) return
      const touched = !!(c.firstName || c.lastName || c.email)
      if (!touched) return
      if (!c.firstName || c.firstName.length < 2)
        ctx.addIssue({
          code: 'custom',
          message: v.contactNameMin,
          path: ['primaryContact', 'firstName'],
        })
      if (!c.lastName || c.lastName.length < 2)
        ctx.addIssue({
          code: 'custom',
          message: v.contactNameMin,
          path: ['primaryContact', 'lastName'],
        })
      if (!c.email)
        ctx.addIssue({
          code: 'custom',
          message: v.contactEmailInvalid,
          path: ['primaryContact', 'email'],
        })
    })
}

export function createUpdateClientSchema(v: V) {
  return createClientSchema(v)
}

export type CreateClientFormData = z.infer<ReturnType<typeof createClientSchema>>
export type UpdateClientFormData = Partial<CreateClientFormData>
