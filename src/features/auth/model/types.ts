import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Campo requerido').email('Email inválido'),
  password: z.string().min(1, 'Campo requerido'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Re-exported for convenience — the canonical type lives in @shared/types
export type { AuthUser as UserProfile } from '@shared/types'
