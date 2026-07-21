import { z } from 'zod'
import type { AuthTranslations } from '../i18n/types'

type V = AuthTranslations['validation']

/**
 * A diferencia de refinePasswordPair en users/model/user.schema.ts (donde una
 * contraseña vacía es válida — create sin invitar, edit = mantener la actual),
 * acá la contraseña siempre es requerida: no hay "dejar como está" posible.
 */
function refineNewPasswordPair(v: V) {
  return (
    d: { password: string; confirmPassword: string },
    ctx: z.RefinementCtx
  ) => {
    const issues: { test: boolean; message: string }[] = [
      { test: d.password.length < 8, message: v.passwordMin },
      { test: !/[A-Z]/.test(d.password), message: v.passwordUppercase },
      { test: !/\d/.test(d.password), message: v.passwordNumber },
    ]
    for (const i of issues) {
      if (i.test) {
        ctx.addIssue({ code: 'custom', message: i.message, path: ['password'] })
      }
    }
    if (d.password !== d.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: v.passwordMismatch,
        path: ['confirmPassword'],
      })
    }
  }
}

export function createResetPasswordSchema(v: V) {
  return z
    .object({
      password: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine(refineNewPasswordPair(v))
}

export type ResetPasswordFormData = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>
