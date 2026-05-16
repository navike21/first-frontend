import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export const updateClientSchema = createClientSchema
  .partial()
  .extend({ status: z.enum(['active', 'inactive', 'prospect']).optional() })

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>

export type ClientStatus = 'active' | 'inactive' | 'prospect'

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  status: ClientStatus
  createdAt: string
  updatedAt: string
}
