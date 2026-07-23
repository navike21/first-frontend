import { useQuery } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'

interface UserPickerItem {
  id: string
  firstName: string
  lastName: string
}

/** Resolves `StorageFile.uploadedBy` (a user id) to a display name in MediaPreviewModal. */
export const useUsersForMediaPicker = () =>
  useQuery({
    queryKey: ['users', 'picker-for-media'],
    queryFn: () =>
      request<ApiResponse<{ items: UserPickerItem[] }>>({
        api: '/users?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data.items ?? [],
    staleTime: 5 * 60 * 1000,
  })
