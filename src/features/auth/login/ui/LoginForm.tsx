import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputField, HelperText } from '@/shared/ui'
import { createLoginSchema, type LoginFormData } from '../model/login.schema'
import { useLogin } from '../model/useLogin'
import { useLoginTranslation } from '../i18n'
import clsx from 'clsx'

export const LoginForm = () => {
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

  return (
    <form
      className={clsx('mt-4 flex w-full max-w-96 flex-col gap-4')}
      onSubmit={handleSubmit(login)}
      noValidate
    >
      <InputField
        label={t.form.username}
        type="text"
        autoComplete="username"
        errorMessage={errors.username?.message}
        variant={errors.username ? 'error' : 'default'}
        {...register('username')}
      />
      <InputField
        label={t.form.password}
        type="password"
        autoComplete="current-password"
        errorMessage={errors.password?.message}
        variant={errors.password ? 'error' : 'default'}
        {...register('password')}
      />

      {errorMessage && <HelperText variant="error">{errorMessage}</HelperText>}

      <Button
        fullWidth
        variant="primary"
        className="mt-4"
        type="submit"
        loading={isPending}
      >
        {t.form.submit}
      </Button>
    </form>
  )
}
