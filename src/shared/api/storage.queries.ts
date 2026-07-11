import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listStorageFiles } from './storage'
import type { StorageListParams } from './storage'

export const storageKeys = {
  all: ['storage'] as const,
  files: (params: StorageListParams) => [...storageKeys.all, 'files', params] as const,
}

/** Media-library picker: paginated list of previously uploaded files. */
export const useStorageFiles = (params: StorageListParams) =>
  useQuery({
    queryKey: storageKeys.files(params),
    queryFn: () => listStorageFiles(params),
    placeholderData: keepPreviousData,
  })
