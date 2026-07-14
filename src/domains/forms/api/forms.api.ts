import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type {
  Form,
  FormListParams,
  FormSubmission,
  FormSubmissionListParams,
} from '../model/form.types'
import type { CreateFormPayload } from '../model/form.schema'

const BASE = '/forms'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

function toQuery(params: object): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

export const formsApi = {
  list: (params: FormListParams = {}) =>
    request<ApiResponse<Form[]>>({
      api: `${BASE}${toQuery(params)}`,
      method: 'GET',
    }),

  getById: (id: string) =>
    request<ApiResponse<Form>>({
      api: `${BASE}/${id}`,
      method: 'GET',
    }),

  create: (body: CreateFormPayload) =>
    request<ApiResponse<Form>, CreateFormPayload>({
      api: BASE,
      method: 'POST',
      body,
    }),

  update: (id: string, body: Partial<CreateFormPayload>) =>
    request<ApiResponse<Form>, Partial<CreateFormPayload>>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body,
    }),

  softDelete: (id: string) =>
    request<ApiResponse<Form>>({
      api: `${BASE}/${id}`,
      method: 'DELETE',
    }),

  trash: (params: { page?: number; limit?: number } = {}) =>
    request<ApiResponse<Form[]>>({
      api: `${BASE}/trash${toQuery(params)}`,
      method: 'GET',
    }),

  restore: (id: string) =>
    request<ApiResponse<Form>>({
      api: `${BASE}/${id}/restore`,
      method: 'PATCH',
    }),

  purge: (id: string) =>
    request<ApiResponse<Form>>({
      api: `${BASE}/${id}/permanent`,
      method: 'DELETE',
    }),

  bulkSoftDelete: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk`,
      method: 'DELETE',
      body: { ids },
    }),

  bulkRestore: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk/restore`,
      method: 'PATCH',
      body: { ids },
    }),

  bulkPurge: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk/permanent`,
      method: 'DELETE',
      body: { ids },
    }),

  submissions: {
    list: (formId: string, params: FormSubmissionListParams = {}) =>
      request<ApiResponse<FormSubmission[]>>({
        api: `${BASE}/${formId}/submissions${toQuery(params)}`,
        method: 'GET',
      }),

    getById: (formId: string, id: string) =>
      request<ApiResponse<FormSubmission>>({
        api: `${BASE}/${formId}/submissions/${id}`,
        method: 'GET',
      }),

    markRead: (formId: string, id: string) =>
      request<ApiResponse<FormSubmission>>({
        api: `${BASE}/${formId}/submissions/${id}/read`,
        method: 'PATCH',
      }),

    softDelete: (formId: string, id: string) =>
      request<ApiResponse<FormSubmission>>({
        api: `${BASE}/${formId}/submissions/${id}`,
        method: 'DELETE',
      }),

    trash: (formId: string, params: { page?: number; limit?: number } = {}) =>
      request<ApiResponse<FormSubmission[]>>({
        api: `${BASE}/${formId}/submissions/trash${toQuery(params)}`,
        method: 'GET',
      }),

    restore: (formId: string, id: string) =>
      request<ApiResponse<FormSubmission>>({
        api: `${BASE}/${formId}/submissions/${id}/restore`,
        method: 'PATCH',
      }),

    purge: (formId: string, id: string) =>
      request<ApiResponse<FormSubmission>>({
        api: `${BASE}/${formId}/submissions/${id}/permanent`,
        method: 'DELETE',
      }),

    bulkSoftDelete: (formId: string, ids: string[]) =>
      request<ApiResponse<BulkResult>, { ids: string[] }>({
        api: `${BASE}/${formId}/submissions/bulk`,
        method: 'DELETE',
        body: { ids },
      }),

    bulkRestore: (formId: string, ids: string[]) =>
      request<ApiResponse<BulkResult>, { ids: string[] }>({
        api: `${BASE}/${formId}/submissions/bulk/restore`,
        method: 'PATCH',
        body: { ids },
      }),

    bulkPurge: (formId: string, ids: string[]) =>
      request<ApiResponse<BulkResult>, { ids: string[] }>({
        api: `${BASE}/${formId}/submissions/bulk/permanent`,
        method: 'DELETE',
        body: { ids },
      }),
  },
}
