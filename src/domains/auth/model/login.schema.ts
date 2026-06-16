import { z } from 'zod'
import type { LoginTranslations } from '../i18n/types'

export function createLoginSchema(v: LoginTranslations['validation']) {
  return z.object({
    email: z.string().email({ error: v.emailInvalid }),
    password: z.string().min(8, { error: v.passwordMin }),
  })
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
