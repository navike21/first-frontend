import { z } from 'zod'
import type { UserGroupsTranslations } from '../i18n/types'

type V = UserGroupsTranslations['validation']

export function createCreateUserGroupSchema(v: V) {
  return z.object({
    name: z.string().min(2, v.nameMin).max(80, v.nameMax).trim(),
    description: z.string().max(255).optional().or(z.literal('')),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, v.colorInvalid),
    permissions: z.array(z.string()).default([]),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export function createUpdateUserGroupSchema(v: V) {
  return createCreateUserGroupSchema(v).partial()
}

export type CreateUserGroupFormData = z.infer<
  ReturnType<typeof createCreateUserGroupSchema>
>
export type UpdateUserGroupFormData = z.infer<
  ReturnType<typeof createUpdateUserGroupSchema>
>
