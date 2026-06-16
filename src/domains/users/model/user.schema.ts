import { z } from 'zod'
import type { UsersTranslations } from '../i18n/types'

type V = UsersTranslations['validation']

const addressSchema = z.object({
  street: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
})

export function createCreateUserSchema(v: V) {
  return z.object({
    email: z.email(v.emailInvalid).toLowerCase(),
    password: z
      .string()
      .min(8, v.passwordMin)
      .regex(/[A-Z]/, v.passwordUppercase)
      .regex(/\d/, v.passwordNumber),
    firstName: z.string().min(2, v.fieldMin2).max(50).trim(),
    lastName: z.string().min(2, v.fieldMin2).max(100).trim(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, v.dateFormat)
      .optional()
      .or(z.literal('')),
    gender: z.enum(['female', 'male', 'other', 'prefer_not_to_say']).optional(),
    phone: z.string().max(30).optional().or(z.literal('')),
    // The avatar is sent as a multipart `avatar` File (handled outside the
    // schema); the backend owns the upload. No URL input in the form.
    address: addressSchema.optional(),
    groupIds: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export function createUpdateUserSchema(v: V) {
  return createCreateUserSchema(v)
    .omit({ email: true, password: true })
    .partial()
}

export const userListSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().optional(),
  groupId: z.string().optional(),
})

export type CreateUserFormData = z.infer<
  ReturnType<typeof createCreateUserSchema>
>
export type UpdateUserFormData = z.infer<
  ReturnType<typeof createUpdateUserSchema>
>
