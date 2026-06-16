import clsx from 'clsx'
import { Button, InputField, HelperText } from '@/shared/ui'
import { useLoginForm } from './LoginForm.hooks'

export const LoginForm = () => {
  const { t, register, onSubmit, errors, isPending, errorMessage } =
    useLoginForm()

  return (
    <form
      className={clsx('mt-4 flex w-full max-w-96 flex-col gap-4')}
      onSubmit={onSubmit}
      noValidate
    >
      <InputField
        label={t.form.email}
        type="email"
        autoComplete="email"
        errorMessage={errors.email?.message}
        variant={errors.email ? 'error' : 'default'}
        {...register('email')}
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
