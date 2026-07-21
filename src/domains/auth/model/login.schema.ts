import { z } from 'zod'
import type { AuthTranslations } from '../i18n/types'

export function createLoginSchema(v: AuthTranslations['validation']) {
  return z.object({
    email: z.string().email({ error: v.emailInvalid }),
    password: z.string().min(8, { error: v.passwordMin }),
  })
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
