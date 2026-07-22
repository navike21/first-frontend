import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createResetPasswordSchema,
  type ResetPasswordFormData,
} from '../../model/resetPassword.schema'
import { useResetPassword } from '../../model/useResetPassword'
import { useAuthTranslation } from '../../i18n'

export function useResetPasswordForm(token: string) {
  const {
    resetPassword,
    isPending,
    isSuccess,
    successMessage,
    isInvalidToken,
    errorMessage,
  } = useResetPassword(token)
  const { t } = useAuthTranslation()
  const schema = useMemo(
    () => createResetPasswordSchema(t.validation),
    [t.validation]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
  })

  return {
    t,
    register,
    onSubmit: handleSubmit(resetPassword),
    errors,
    isPending,
    isSuccess,
    successMessage,
    isInvalidToken,
    errorMessage,
  }
}
