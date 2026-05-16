import { z } from 'zod'

export const createTeamMemberSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  role: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido').optional(),
  bio: z.string().optional(),
  avatar: z.string().url('URL inválida').optional(),
  order: z.number().int().nonnegative().optional(),
})

export const updateTeamMemberSchema = createTeamMemberSchema
  .partial()
  .extend({ active: z.boolean().optional() })

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>

export interface TeamMember {
  id: string
  name: string
  role: string
  email?: string
  bio?: string
  avatar?: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}
