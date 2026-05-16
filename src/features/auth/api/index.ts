import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@shared/api'
import { notify } from '@shared/lib/notify'
import { useSessionStore } from '@shared/model'
import type { LoginInput } from '../model/types'

export const authKeys = {
  me: ['auth', 'me'] as const,
  sessions: ['auth', 'sessions'] as const,
}

export function useLogin() {
  const setSession = useSessionStore((s) => s.setSession)

  return useMutation({
    mutationFn: ({ email, password }: LoginInput) => authService.signIn(email, password),
    onSuccess: ({ token, user }) => {
      setSession(token, user)
      notify.success(`Bienvenido, ${user.name}`)
    },
  })
}

export function useLogout() {
  const clearSession = useSessionStore((s) => s.clearSession)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSettled: () => {
      clearSession()
      qc.clear()
    },
  })
}
