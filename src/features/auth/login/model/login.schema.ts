import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, { error: 'Introduce tu nombre de usuario' }),
  password: z
    .string()
    .min(8, { error: 'La contraseña debe tener al menos 8 caracteres' }),
})

export type LoginFormData = z.infer<typeof loginSchema>
