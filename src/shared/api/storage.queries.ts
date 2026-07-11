import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listStorageFiles,
  listDeletedStorageFiles,
  uploadStorageImages,
  deleteStorageFiles,
  restoreStorageFile,
  bulkRestoreStorageFiles,
  purgeStorageFiles,
  getStorageFileUsages,
} from './storage'
import type { StorageListParams } from './storage'

export const storageKeys = {
  all: ['storage'] as const,
  files: (params: StorageListParams) => [...storageKeys.all, 'files', params] as const,
  trash: () => [...storageKeys.all, 'trash'] as const,
  trashList: (params: StorageListParams) => [...storageKeys.trash(), params] as const,
  usages: (id: string) => [...storageKeys.all, 'usages', id] as const,
}

/** Media-library picker: paginated list of previously uploaded files. */
export const useStorageFiles = (params: StorageListParams) =>
  useQuery({
    queryKey: storageKeys.files(params),
    queryFn: () => listStorageFiles(params),
    placeholderData: keepPreviousData,
  })

/** Multimedia trash page: paginated list of soft-deleted files. */
export const useStorageTrash = (params: StorageListParams) =>
  useQuery({
    queryKey: storageKeys.trashList(params),
    queryFn: () => listDeletedStorageFiles(params),
    placeholderData: keepPreviousData,
  })

/** Multimedia preview modal's "Uso" tab — lazy (only fetched while the tab is visible). */
export const useStorageFileUsages = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: storageKeys.usages(id),
    queryFn: () => getStorageFileUsages(id),
    enabled,
  })

export const useUploadStorageImages = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (files: File[]) => uploadStorageImages(files),
    onSuccess: () => qc.invalidateQueries({ queryKey: storageKeys.all }),
  })
}

/** Soft-delete (move to trash). Bulk-only endpoint — pass a single id as `[id]`. */
export const useSoftDeleteStorageFiles = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => deleteStorageFiles(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: storageKeys.all }),
  })
}

export const useRestoreStorageFile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => restoreStorageFile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: storageKeys.all }),
  })
}

export const useBulkRestoreStorageFiles = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => bulkRestoreStorageFiles(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: storageKeys.all }),
  })
}

/** Permanently delete (purge). Bulk-only endpoint — pass a single id as `[id]`. */
export const usePurgeStorageFiles = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => purgeStorageFiles(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: storageKeys.all }),
  })
}
