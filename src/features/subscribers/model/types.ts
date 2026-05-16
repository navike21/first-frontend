import { z } from 'zod'

export const createSubscriberSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>

export interface Subscriber {
  id: string
  email: string
  name?: string
  tags?: string[]
  status: 'subscribed' | 'unsubscribed'
  createdAt: string
  updatedAt: string
}
