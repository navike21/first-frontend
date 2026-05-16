import { z } from 'zod'

export const createPortfolioItemSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  clientId: z.string().optional(),
  serviceIds: z.array(z.string()).optional(),
  coverImage: z.string().url('URL inválida').optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
})

export const updatePortfolioItemSchema = createPortfolioItemSchema
  .partial()
  .extend({ status: z.enum(['draft', 'published', 'archived']).optional() })

export type CreatePortfolioItemInput = z.infer<typeof createPortfolioItemSchema>
export type UpdatePortfolioItemInput = z.infer<typeof updatePortfolioItemSchema>

export type PortfolioStatus = 'draft' | 'published' | 'archived'

export interface PortfolioItem {
  id: string
  title: string
  description?: string
  clientId?: string
  serviceIds?: string[]
  coverImage?: string
  tags?: string[]
  status: PortfolioStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
