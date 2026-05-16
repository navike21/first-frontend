import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, setAccessToken, clearAccessToken } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import { useAuthStore } from '../store'
import type { ApiResponse } from '@shared/api/types'
import type { AuthTokens, LoginInput, UserProfile } from '../model/types'

export const authKeys = {
  me: ['auth', 'me'] as const,
  sessions: ['auth', 'sessions'] as const,
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await apiClient.post<ApiResponse<AuthTokens & { user: UserProfile }>>(
        '/auth/login',
        input,
      )
      return data.data
    },
    onSuccess: ({ accessToken, user }) => {
      setAccessToken(accessToken)
      setUser(user)
      void qc.invalidateQueries({ queryKey: authKeys.me })
      notify.success(`Bienvenido, ${user.firstName}`)
    },
  })
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSettled: () => {
      clearAccessToken()
      clearAuth()
      qc.clear()
    },
  })
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<UserProfile>>('/users/me')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  })
}
