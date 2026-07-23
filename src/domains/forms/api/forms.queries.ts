import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formsApi } from './forms.api'
import type {
  FormListParams,
  FormSubmissionListParams,
} from '../model/form.types'
import type { CreateFormPayload } from '../model/form.schema'

export const formKeys = {
  all: ['forms'] as const,
  lists: () => [...formKeys.all, 'list'] as const,
  list: (params: FormListParams) => [...formKeys.lists(), params] as const,
  details: () => [...formKeys.all, 'detail'] as const,
  detail: (id: string) => [...formKeys.details(), id] as const,
  trash: () => [...formKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...formKeys.trash(), params] as const,
}

export const formSubmissionKeys = {
  all: (formId: string) => ['forms', formId, 'submissions'] as const,
  lists: (formId: string) =>
    [...formSubmissionKeys.all(formId), 'list'] as const,
  list: (formId: string, params: FormSubmissionListParams) =>
    [...formSubmissionKeys.lists(formId), params] as const,
  details: (formId: string) =>
    [...formSubmissionKeys.all(formId), 'detail'] as const,
  detail: (formId: string, id: string) =>
    [...formSubmissionKeys.details(formId), id] as const,
  trash: (formId: string) =>
    [...formSubmissionKeys.all(formId), 'trash'] as const,
  trashList: (formId: string, params: { page?: number; limit?: number }) =>
    [...formSubmissionKeys.trash(formId), params] as const,
}

export const useForms = (params: FormListParams = {}) =>
  useQuery({
    queryKey: formKeys.list(params),
    queryFn: () => formsApi.list(params),
  })

export const useForm = (id: string) =>
  useQuery({
    queryKey: formKeys.detail(id),
    queryFn: () => formsApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useCreateForm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFormPayload) => formsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: formKeys.lists() }),
  })
}

export const useUpdateForm = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateFormPayload>) => formsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formKeys.lists() })
      qc.invalidateQueries({ queryKey: formKeys.detail(id) })
    },
  })
}

export const useSoftDeleteForm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => formsApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formKeys.lists() })
      qc.invalidateQueries({ queryKey: formKeys.trash() })
    },
  })
}

export const useFormsTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: formKeys.trashList(params),
    queryFn: () => formsApi.trash(params),
  })

export const useRestoreForm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => formsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formKeys.trash() })
      qc.invalidateQueries({ queryKey: formKeys.lists() })
    },
  })
}

export const usePurgeForm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => formsApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: formKeys.trash() }),
  })
}

export const useBulkSoftDeleteForms = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => formsApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formKeys.lists() })
      qc.invalidateQueries({ queryKey: formKeys.trash() })
    },
  })
}

export const useBulkRestoreForms = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => formsApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formKeys.trash() })
      qc.invalidateQueries({ queryKey: formKeys.lists() })
    },
  })
}

export const useBulkPurgeForms = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => formsApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: formKeys.trash() }),
  })
}

// --- Submissions ---

export const useFormSubmissions = (
  formId: string,
  params: FormSubmissionListParams = {}
) =>
  useQuery({
    queryKey: formSubmissionKeys.list(formId, params),
    queryFn: () => formsApi.submissions.list(formId, params),
    enabled: !!formId,
  })

export const useFormSubmissionsTrash = (
  formId: string,
  params: { page?: number; limit?: number } = {}
) =>
  useQuery({
    queryKey: formSubmissionKeys.trashList(formId, params),
    queryFn: () => formsApi.submissions.trash(formId, params),
    enabled: !!formId,
  })

export const useMarkFormSubmissionRead = (formId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => formsApi.submissions.markRead(formId, id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: formSubmissionKeys.lists(formId) }),
  })
}

export const useSoftDeleteFormSubmission = (formId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => formsApi.submissions.softDelete(formId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formSubmissionKeys.lists(formId) })
      qc.invalidateQueries({ queryKey: formSubmissionKeys.trash(formId) })
    },
  })
}

export const useRestoreFormSubmission = (formId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => formsApi.submissions.restore(formId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formSubmissionKeys.trash(formId) })
      qc.invalidateQueries({ queryKey: formSubmissionKeys.lists(formId) })
    },
  })
}

export const usePurgeFormSubmission = (formId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => formsApi.submissions.purge(formId, id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: formSubmissionKeys.trash(formId) }),
  })
}

export const useBulkSoftDeleteFormSubmissions = (formId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      formsApi.submissions.bulkSoftDelete(formId, ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formSubmissionKeys.lists(formId) })
      qc.invalidateQueries({ queryKey: formSubmissionKeys.trash(formId) })
    },
  })
}

export const useBulkRestoreFormSubmissions = (formId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      formsApi.submissions.bulkRestore(formId, ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: formSubmissionKeys.trash(formId) })
      qc.invalidateQueries({ queryKey: formSubmissionKeys.lists(formId) })
    },
  })
}

export const useBulkPurgeFormSubmissions = (formId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => formsApi.submissions.bulkPurge(formId, ids),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: formSubmissionKeys.trash(formId) }),
  })
}
