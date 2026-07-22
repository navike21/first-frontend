import { z } from 'zod'
import type { AuthTranslations } from '../i18n/types'

export function createForgotPasswordSchema(v: AuthTranslations['validation']) {
  return z.object({
    email: z.string().email({ error: v.emailInvalid }),
  })
}

export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>
