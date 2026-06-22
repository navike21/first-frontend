import { z } from 'zod'
import type { UsersTranslations } from '../i18n/types'

type V = UsersTranslations['validation']

const addressSchema = z.object({
  street: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
})

const passwordRules = (v: V) =>
  z
    .string()
    .min(8, v.passwordMin)
    .regex(/[A-Z]/, v.passwordUppercase)
    .regex(/\d/, v.passwordNumber)

// ── API payload schemas (what is sent to the backend) ──────────────────────────

export function createCreateUserSchema(v: V) {
  return z.object({
    email: z.email(v.emailInvalid).toLowerCase(),
    password: passwordRules(v),
    firstName: z.string().min(2, v.fieldMin2).max(50).trim(),
    lastName: z.string().min(2, v.fieldMin2).max(100).trim(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, v.dateFormat)
      .optional()
      .or(z.literal('')),
    gender: z.enum(['female', 'male', 'other', 'prefer_not_to_say']).optional(),
    phone: z.string().max(30).optional().or(z.literal('')),
    // The avatar is sent as a multipart `avatar` File (handled outside the
    // schema); the backend owns the upload. No URL input in the form.
    address: addressSchema.optional(),
    groupIds: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export function createUpdateUserSchema(v: V) {
  // Email stays immutable on edit; password becomes optional (admin may reset
  // it — backend hashes + invalidates sessions). Other fields are partial.
  return createCreateUserSchema(v)
    .omit({ email: true, password: true })
    .partial()
    .extend({ password: passwordRules(v).optional() })
}

// ── Form schemas (add the UI-only `confirmPassword` + match validation) ────────

export function createCreateUserFormSchema(v: V) {
  return createCreateUserSchema(v)
    .extend({ confirmPassword: z.string() })
    .refine((d) => d.password === d.confirmPassword, {
      message: v.passwordMismatch,
      path: ['confirmPassword'],
    })
}

export function createUpdateUserFormSchema(v: V) {
  // Password is optional on edit; `''` means "keep current". When a new
  // password is typed it must meet the strength rules AND match the confirm.
  return createCreateUserSchema(v)
    .omit({ email: true, password: true })
    .partial()
    .extend({
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .superRefine((d, ctx) => {
      if (!d.password) return
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
    })
}

export const userListSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().optional(),
  groupId: z.string().optional(),
})

// API payload types (sent to the backend) — no `confirmPassword`.
export type CreateUserFormData = z.infer<
  ReturnType<typeof createCreateUserSchema>
>
export type UpdateUserFormData = z.infer<
  ReturnType<typeof createUpdateUserSchema>
>

// Form value types (what the form holds) — include the UI-only `confirmPassword`.
export type CreateUserFormValues = z.infer<
  ReturnType<typeof createCreateUserFormSchema>
>
export type UpdateUserFormValues = z.infer<
  ReturnType<typeof createUpdateUserFormSchema>
>
