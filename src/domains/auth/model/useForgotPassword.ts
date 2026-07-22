import { useMutation } from '@tanstack/react-query'
import { forgotPasswordApi } from '../api/forgotPassword.api'
import type { ForgotPasswordFormData } from './forgotPassword.schema'

interface UseForgotPasswordReturn {
  requestReset: (data: ForgotPasswordFormData) => void
  isPending: boolean
  isSuccess: boolean
  /** Mensaje ya traducido que devuelve el backend (AUTH_FORGOT_PASSWORD_SENT). */
  successMessage: string | null
  errorMessage: string | null
}

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const { mutate, isPending, isSuccess, data, error } = useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: forgotPasswordApi,
  })

  return {
    requestReset: mutate,
    isPending,
    isSuccess,
    successMessage: data?.message ?? null,
    errorMessage: error?.message ?? null,
  }
}
