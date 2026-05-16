import { z } from 'zod'

export const createUserGroupSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Selecciona al menos un permiso'),
})

export const updateUserGroupSchema = createUserGroupSchema.partial()

export type CreateUserGroupInput = z.infer<typeof createUserGroupSchema>
export type UpdateUserGroupInput = z.infer<typeof updateUserGroupSchema>

export interface UserGroup {
  id: string
  name: string
  description?: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}
