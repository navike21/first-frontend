import { useMutation } from '@tanstack/react-query'
import { HttpError } from '@/shared/api'
import { resetPasswordApi } from '../api/resetPassword.api'
import type { ResetPasswordFormData } from './resetPassword.schema'

interface UseResetPasswordReturn {
  resetPassword: (data: ResetPasswordFormData) => void
  isPending: boolean
  isSuccess: boolean
  /** Mensaje ya traducido que devuelve el backend (AUTH_PASSWORD_RESET). */
  successMessage: string | null
  /** true si el token es inválido/expiró/ya se usó — la UI muestra un estado
   * dedicado en vez del error inline genérico. */
  isInvalidToken: boolean
  errorMessage: string | null
}

export const useResetPassword = (token: string): UseResetPasswordReturn => {
  const { mutate, isPending, isSuccess, data, error } = useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: (formData: ResetPasswordFormData) =>
      resetPasswordApi({ token, password: formData.password }),
  })

  const isInvalidToken =
    error instanceof HttpError && error.code === 'INVALID_TOKEN'

  return {
    resetPassword: mutate,
    isPending,
    isSuccess,
    successMessage: data?.message ?? null,
    isInvalidToken,
    errorMessage: isInvalidToken ? null : (error?.message ?? null),
  }
}
