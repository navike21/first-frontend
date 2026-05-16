import { z } from 'zod'

const addressSchema = z.object({
  street: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
})

export const createUserSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  firstName: z.string().min(2, 'Mínimo 2 caracteres').max(50).trim(),
  lastName: z.string().min(2, 'Mínimo 2 caracteres').max(100).trim(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD').optional().or(z.literal('')),
  gender: z.enum(['female', 'male', 'other', 'prefer_not_to_say']).optional(),
  phone: z.string().max(30).optional().or(z.literal('')),
  profilePictureUrl: z.string().url('URL inválida').max(500).optional().or(z.literal('')),
  address: addressSchema.optional(),
  groupId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

export const updateUserSchema = createUserSchema
  .omit({ email: true, password: true })
  .partial()

export const userListSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().optional(),
  groupId: z.string().optional(),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
