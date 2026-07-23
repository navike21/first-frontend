import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from './users.api'
import { useSessionStore } from '@/shared/model'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import type { User, UserListParams } from '../model/user.types'
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from '../model/user.schema'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  trash: () => [...userKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...userKeys.trash(), params] as const,
}

export const useUsers = (params: UserListParams = {}) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
    select: (res) => res.data,
  })

export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useMyProfile = () =>
  useQuery({
    queryKey: [...userKeys.all, 'me'] as const,
    queryFn: () => usersApi.me(),
    select: (res) => res.data,
  })

export interface CreateUserVars {
  data: CreateUserFormData
  avatar?: File | null
  /** Already-hosted URL picked from the media library (no upload needed). */
  avatarLibraryUrl?: string
}

export interface UpdateUserVars {
  data: UpdateUserFormData
  avatar?: File | null
  /** When true (and no new avatar), clears the existing profile photo. */
  removeAvatar?: boolean
  /** Already-hosted URL picked from the media library (no upload needed). */
  avatarLibraryUrl?: string
}

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, avatar, avatarLibraryUrl }: CreateUserVars) =>
      usersApi.create(data, avatar, avatarLibraryUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}

export const useUpdateUser = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      avatar,
      removeAvatar,
      avatarLibraryUrl,
    }: UpdateUserVars) =>
      usersApi.update(id, data, avatar, removeAvatar, avatarLibraryUrl),
    onSuccess: (res) => {
      const updated = res.data

      qc.setQueriesData<ApiResponse<PaginatedData<User>>>(
        { queryKey: userKeys.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((u) =>
                u.id === id ? { ...u, ...updated } : u
              ),
            },
          }
        }
      )

      qc.invalidateQueries({ queryKey: userKeys.lists() })
      qc.invalidateQueries({ queryKey: userKeys.detail(id) })

      const { user, token, setSession } = useSessionStore.getState()
      if (user && token && user.id === id) {
        setSession(token, {
          ...user,
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
          profilePictureUrl: updated.profilePictureUrl,
        })
      }
    },
  })
}

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      avatar,
      removeAvatar,
      avatarLibraryUrl,
    }: UpdateUserVars) =>
      usersApi.updateProfile(data, avatar, removeAvatar, avatarLibraryUrl),
    onSuccess: (res) => {
      const updated = res.data
      const id = updated.id

      qc.setQueriesData<ApiResponse<PaginatedData<User>>>(
        { queryKey: userKeys.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((u) =>
                u.id === id ? { ...u, ...updated } : u
              ),
            },
          }
        }
      )

      qc.invalidateQueries({ queryKey: userKeys.lists() })
      qc.invalidateQueries({ queryKey: userKeys.detail(id) })

      const { user, token, setSession } = useSessionStore.getState()
      if (user && token && user.id === id) {
        setSession(token, {
          ...user,
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
          profilePictureUrl: updated.profilePictureUrl,
        })
      }
    },
  })
}

export const useSoftDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.softDelete(id),
    onSuccess: () => {
      // Invalidate the trash too: deleting again after a restore must refresh
      // the (otherwise stale, empty) trash list.
      qc.invalidateQueries({ queryKey: userKeys.lists() })
      qc.invalidateQueries({ queryKey: userKeys.trash() })
    },
  })
}

export const useUsersTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: userKeys.trashList(params),
    queryFn: () => usersApi.trash(params),
    select: (res) => res.data,
  })

export const useRestoreUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.trash() })
      qc.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const usePurgeUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.trash() }),
  })
}

export const useBulkSoftDeleteUsers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => usersApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() })
      qc.invalidateQueries({ queryKey: userKeys.trash() })
    },
  })
}

export const useBulkRestoreUsers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => usersApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.trash() })
      qc.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const useBulkPurgeUsers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => usersApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.trash() }),
  })
}
