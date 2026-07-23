import { z } from 'zod'
import type { SubscribersTranslations } from '../i18n/types'

type V = SubscribersTranslations['validation']

const optional = z.string().trim().optional().or(z.literal(''))

export function createSubscriberSchema(v: V) {
  return z.object({
    firstName: z.string().trim().min(2, v.nameMin).max(50, v.nameMax),
    lastName: z.string().trim().min(2, v.nameMin).max(100, v.nameMax),
    contactInformation: z.object({
      email: z.email(v.emailInvalid),
      phoneNumber: optional,
    }),
    location: z
      .object({
        countryCode: z
          .string()
          .trim()
          .length(2)
          .transform((c) => c.toUpperCase())
          .optional()
          .or(z.literal('')),
        ubigeoCode: optional,
        region: optional,
        province: optional,
        district: optional,
        address: z
          .string()
          .trim()
          .max(300, v.addressMax)
          .optional()
          .or(z.literal('')),
        addressNumber: optional,
        addressInterior: optional,
      })
      .optional(),
    personalInformation: z.object({
      gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
        message: v.required,
      }),
      dateOfBirth: z.string().trim().optional().or(z.literal('')),
      profilePictureUrl: z.url(v.urlInvalid).optional().or(z.literal('')),
    }),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export type SubscriberFormData = z.infer<
  ReturnType<typeof createSubscriberSchema>
>

export interface CreateSubscriberPayload {
  firstName: string
  lastName: string
  contactInformation: {
    email: string
    phoneNumber?: string
  }
  location?: {
    countryCode?: string
    ubigeoCode?: string
    region?: string
    province?: string
    district?: string
    address?: string
    addressNumber?: string
    addressInterior?: string
  }
  personalInformation: {
    gender: string
    dateOfBirth?: string
    profilePictureUrl?: string
  }
  status?: 'active' | 'inactive'
}

function buildLocation(
  loc: SubscriberFormData['location']
): CreateSubscriberPayload['location'] | undefined {
  if (!loc || !Object.values(loc).some(Boolean)) return undefined
  return {
    countryCode: loc.countryCode || undefined,
    ubigeoCode: loc.ubigeoCode || undefined,
    region: loc.region || undefined,
    province: loc.province || undefined,
    district: loc.district || undefined,
    address: loc.address || undefined,
    addressNumber: loc.addressNumber || undefined,
    addressInterior: loc.addressInterior || undefined,
  }
}

export function toSubscriberPayload(
  data: SubscriberFormData
): CreateSubscriberPayload {
  const pi = data.personalInformation
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    contactInformation: {
      email: data.contactInformation.email,
      phoneNumber: data.contactInformation.phoneNumber || undefined,
    },
    location: buildLocation(data.location),
    personalInformation: {
      gender: pi.gender,
      dateOfBirth: pi.dateOfBirth || undefined,
      profilePictureUrl: pi.profilePictureUrl || undefined,
    },
    status: data.status,
  }
}
