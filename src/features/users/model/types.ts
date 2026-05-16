import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  userGroupId: z.string().min(1, 'Selecciona un grupo'),
})

export const updateUserSchema = createUserSchema
  .omit({ password: true, email: true })
  .extend({
    status: z.enum(['active', 'inactive']),
    presenceStatus: z.enum(['online', 'away', 'offline']).optional(),
  })
  .partial()

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  status: 'active' | 'inactive'
  userGroupId: string
  permissions: string[]
  presenceStatus?: 'online' | 'away' | 'offline'
  createdAt: string
  updatedAt: string
}
