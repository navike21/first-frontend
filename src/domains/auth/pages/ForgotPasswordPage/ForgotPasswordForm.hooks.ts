import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../../model/forgotPassword.schema'
import { useForgotPassword } from '../../model/useForgotPassword'
import { useAuthTranslation } from '../../i18n'

export function useForgotPasswordForm() {
  const { requestReset, isPending, isSuccess, successMessage, errorMessage } =
    useForgotPassword()
  const { t } = useAuthTranslation()
  const schema = useMemo(
    () => createForgotPasswordSchema(t.validation),
    [t.validation]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  })

  return {
    t,
    register,
    onSubmit: handleSubmit(requestReset),
    errors,
    isPending,
    isSuccess,
    successMessage,
    errorMessage,
  }
}
