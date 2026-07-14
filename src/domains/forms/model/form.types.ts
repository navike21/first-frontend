export type FormStatus = 'active' | 'inactive'

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'

export interface FormFieldOption {
  value: string
  label: Record<string, string>
}

export interface FormField {
  fieldId?: string
  type: FormFieldType
  label: Record<string, string>
  placeholder?: Record<string, string>
  required: boolean
  options?: FormFieldOption[]
  maxLength?: number
}

export interface Form {
  id: string
  title: Record<string, string>
  description?: Record<string, string>
  successMessage?: Record<string, string>
  status: FormStatus
  notificationEmails: string[]
  fields: FormField[]
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface FormSubmission {
  id: string
  formId: string
  data: Record<string, unknown>
  isRead: boolean
  ipAddress?: string
  userAgent?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface FormListParams {
  page?: number
  limit?: number
  status?: FormStatus
  search?: string
}

export interface FormSubmissionListParams {
  page?: number
  limit?: number
  isRead?: boolean
}

export interface FormPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
