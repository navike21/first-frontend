import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from './users.api'
import { useSessionStore } from '@/shared/model'
import type { UserListParams } from '../model/user.types'
import type { CreateUserFormData, UpdateUserFormData } from '../model/user.schema'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
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

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserFormData) => usersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}

export const useUpdateUser = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserFormData) => usersApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() })
      qc.invalidateQueries({ queryKey: userKeys.detail(id) })

      const { user, token, setSession } = useSessionStore.getState()
      if (user && token && user.id === id) {
        const updated = res.data
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
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}
