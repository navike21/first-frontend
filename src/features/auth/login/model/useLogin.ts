import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { loginApi } from '../api/login.api'
import { useSessionStore } from '@/shared/model'
import { HttpError } from '@/shared/api'
import { NAV } from '@/shared/router'
import type { LoginFormData } from './login.schema'

interface UseLoginReturn {
  errorMessage: string | null
  isPending: boolean

  login: (data: LoginFormData) => void
}

export const useLogin = (): UseLoginReturn => {
  const setSession = useSessionStore((state) => state.setSession)
  const router = useRouter()

  const { mutate, isPending, error } = useMutation({
    mutationKey: ['login'],
    mutationFn: loginApi,
    onSuccess: ({ token, user }) => {
      setSession(token, user)
      router.navigate({ to: NAV.home.path }).catch(() => null)
    },
  })

  const errorMessage =
    error instanceof HttpError
      ? `Error ${error.status}: ${error.statusText}`
      : (error?.message ?? null)

  return {
    errorMessage,
    isPending,

    login: mutate,
  }
}
