import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type { FormsTranslations } from '../i18n/types'
import type { FormFieldType } from './form.types'

type V = FormsTranslations['validation']

export const FORM_FIELD_TYPES: FormFieldType[] = [
  'text',
  'textarea',
  'email',
  'phone',
  'select',
  'radio',
  'checkbox',
  'date',
]

function localizedSchema(v: V, primaryLang: Language, required: boolean) {
  const optionalText = z.string().trim().optional().or(z.literal(''))
  const langFields = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [
      l,
      required && l === primaryLang ? z.string().trim().min(1, v.required) : optionalText,
    ])
  ) as unknown as Record<Language, z.ZodTypeAny>
  return z.object(langFields)
}

export function createFormSchema(v: V, primaryLang: Language = 'en') {
  const fieldSchema = z
    .object({
      fieldId: z.string().optional(),
      type: z.enum(FORM_FIELD_TYPES as [FormFieldType, ...FormFieldType[]]),
      label: localizedSchema(v, primaryLang, true),
      placeholder: localizedSchema(v, primaryLang, false),
      required: z.boolean(),
      options: z
        .array(
          z.object({
            value: z.string().trim().min(1, v.required),
            label: localizedSchema(v, primaryLang, true),
          })
        )
        .default([]),
      maxLength: z.coerce.number().int().min(1).optional(),
    })
    .refine(
      (field) => field.type !== 'select' && field.type !== 'radio' ? true : field.options.length >= 2,
      { message: v.optionsRequired, path: ['options'] }
    )

  return z.object({
    title: localizedSchema(v, primaryLang, true),
    description: localizedSchema(v, primaryLang, false),
    successMessage: localizedSchema(v, primaryLang, false),
    status: z.enum(['active', 'inactive']).default('active'),
    notificationEmails: z.string().trim().optional().or(z.literal('')),
    fields: z.array(fieldSchema).min(1, v.fieldsMin),
  })
}

export type FormFormLocalized = Record<Language, string>

export interface FormFormField {
  fieldId?: string
  type: FormFieldType
  label: FormFormLocalized
  placeholder: FormFormLocalized
  required: boolean
  options: { value: string; label: FormFormLocalized }[]
  maxLength?: number
}

export interface FormFormData {
  title: FormFormLocalized
  description: FormFormLocalized
  successMessage: FormFormLocalized
  status: 'active' | 'inactive'
  notificationEmails: string
  fields: FormFormField[]
}

export interface CreateFormPayload {
  title: FormFormLocalized
  description?: FormFormLocalized
  successMessage?: FormFormLocalized
  status: 'active' | 'inactive'
  notificationEmails: string[]
  fields: {
    fieldId?: string
    type: FormFieldType
    label: FormFormLocalized
    placeholder?: FormFormLocalized
    required: boolean
    options?: { value: string; label: FormFormLocalized }[]
    maxLength?: number
  }[]
}

function fillLocalized(input: Partial<Record<Language, string>>): FormFormLocalized {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, input[l]?.trim() ?? ''])
  ) as unknown as FormFormLocalized
}

export function toFormPayload(data: FormFormData): CreateFormPayload {
  return {
    title: fillLocalized(data.title),
    description: fillLocalized(data.description),
    successMessage: fillLocalized(data.successMessage),
    status: data.status,
    notificationEmails: data.notificationEmails
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean),
    fields: data.fields.map((field) => ({
      fieldId: field.fieldId,
      type: field.type,
      label: fillLocalized(field.label),
      placeholder: fillLocalized(field.placeholder),
      required: field.required,
      options:
        field.type === 'select' || field.type === 'radio'
          ? field.options.map((o) => ({ value: o.value, label: fillLocalized(o.label) }))
          : undefined,
      maxLength: field.maxLength,
    })),
  }
}
