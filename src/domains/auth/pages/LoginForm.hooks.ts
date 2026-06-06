import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLoginSchema, type LoginFormData } from '../model/login.schema'
import { useLogin } from '../model/useLogin'
import { useLoginTranslation } from '../i18n'

export function useLoginForm() {
  const { login, isPending, errorMessage } = useLogin()
  const { t } = useLoginTranslation()
  const schema = useMemo(() => createLoginSchema(t.validation), [t.validation])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  })

  return {
    t,
    register,
    onSubmit: handleSubmit(login),
    errors,
    isPending,
    errorMessage,
  }
}
