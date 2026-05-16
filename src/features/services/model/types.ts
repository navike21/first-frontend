import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo').optional(),
  category: z.string().optional(),
})

export const updateServiceSchema = createServiceSchema
  .partial()
  .extend({ status: z.enum(['active', 'inactive']).optional() })

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>

export interface Service {
  id: string
  name: string
  description?: string
  price?: number
  category?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
