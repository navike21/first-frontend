import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@shared/api/types'
import type { StorageFile, UploadResult } from '../model/types'

export const storageKeys = {
  all: ['storage'] as const,
  list: (params?: PaginationParams) => ['storage', 'list', params] as const,
}

export function useStorageFiles(params?: PaginationParams) {
  return useQuery({
    queryKey: storageKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<StorageFile>>>(
        '/storage',
        {
          params,
        },
      )
      return data.data
    },
  })
}

export function useUploadFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const { data } = await apiClient.post<ApiResponse<StorageFile>>('/storage/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: storageKeys.all })
      notify.success('Archivo subido')
    },
  })
}

export function useUploadFiles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (files: File[]) => {
      const form = new FormData()
      files.forEach((f) => form.append('files', f))
      const { data } = await apiClient.post<ApiResponse<UploadResult>>(
        '/storage/upload/bulk',
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      return data.data
    },
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: storageKeys.all })
      notify.success(`${result.files.length} archivo(s) subido(s)`)
    },
  })
}

export function useDeleteFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/storage/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: storageKeys.all })
      notify.success('Archivo eliminado')
    },
  })
}
