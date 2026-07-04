import { z } from 'zod'
import type { SubscribersTranslations } from '../i18n/types'

type V = SubscribersTranslations['validation']

export function createSubscriberSchema(v: V) {
  return z.object({
    firstName: z.string().trim().min(2, v.nameMin).max(50, v.nameMax),
    lastName: z.string().trim().min(2, v.nameMin).max(100, v.nameMax),
    contactInformation: z.object({
      email: z.email(v.emailInvalid),
      phoneNumber: z
        .string()
        .trim()
        .min(9, v.phoneMin)
        .max(15, v.phoneMax)
        .optional()
        .or(z.literal('')),
      address: z
        .string()
        .trim()
        .min(10, v.addressMin)
        .max(300, v.addressMax)
        .optional()
        .or(z.literal('')),
    }),
    personalInformation: z.object({
      gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
        message: v.required,
      }),
      dateOfBirth: z.string().trim().optional().or(z.literal('')),
      profilePictureUrl: z
        .url(v.urlInvalid)
        .optional()
        .or(z.literal('')),
    }),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export type SubscriberFormData = z.infer<ReturnType<typeof createSubscriberSchema>>

export interface CreateSubscriberPayload {
  firstName: string
  lastName: string
  contactInformation: {
    email: string
    phoneNumber?: string
    address?: string
  }
  personalInformation: {
    gender: string
    dateOfBirth?: string
    profilePictureUrl?: string
  }
  status?: 'active' | 'inactive'
}

export function toSubscriberPayload(data: SubscriberFormData): CreateSubscriberPayload {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    contactInformation: {
      email: data.contactInformation.email,
      ...(data.contactInformation.phoneNumber
        ? { phoneNumber: data.contactInformation.phoneNumber }
        : {}),
      ...(data.contactInformation.address
        ? { address: data.contactInformation.address }
        : {}),
    },
    personalInformation: {
      gender: data.personalInformation.gender,
      ...(data.personalInformation.dateOfBirth
        ? { dateOfBirth: data.personalInformation.dateOfBirth }
        : {}),
      ...(data.personalInformation.profilePictureUrl
        ? { profilePictureUrl: data.personalInformation.profilePictureUrl }
        : {}),
    },
    status: data.status,
  }
}
