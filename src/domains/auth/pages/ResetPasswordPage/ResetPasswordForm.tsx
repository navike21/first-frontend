import clsx from 'clsx'
import { Button, InputField, HelperText, LinkButton } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useResetPasswordForm } from './ResetPasswordForm.hooks'

interface ResetPasswordFormProps {
  /** Ausente = enlace roto (sin token en la URL); nunca se llega a intentar el submit. */
  token?: string
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const {
    t,
    register,
    onSubmit,
    errors,
    isPending,
    isSuccess,
    successMessage,
    isInvalidToken,
    errorMessage,
  } = useResetPasswordForm(token ?? '')

  if (!token || isInvalidToken) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-foreground text-base font-semibold">
          {t.resetPassword.invalidTokenHeading}
        </h2>
        <p className="text-secondary text-sm">
          {t.resetPassword.invalidTokenMessage}
        </p>
        <LinkButton variant="primary" href={navPaths.forgotPassword()}>
          {t.resetPassword.requestNewLinkLink}
        </LinkButton>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-foreground text-base font-semibold">
          {t.resetPassword.successHeading}
        </h2>
        {successMessage && (
          <p className="text-secondary text-sm">{successMessage}</p>
        )}
        <LinkButton variant="primary" href={navPaths.login()}>
          {t.resetPassword.backToLoginLink}
        </LinkButton>
      </div>
    )
  }

  return (
    <form
      className={clsx('flex w-full flex-col gap-4')}
      onSubmit={onSubmit}
      noValidate
    >
      <h2 className="text-foreground mb-2 text-base font-semibold">
        {t.resetPassword.heading}
      </h2>
      <InputField
        label={t.resetPassword.newPasswordLabel}
        type="password"
        autoComplete="new-password"
        errorMessage={errors.password?.message}
        variant={errors.password ? 'error' : 'default'}
        {...register('password')}
      />
      <InputField
        label={t.resetPassword.confirmPasswordLabel}
        type="password"
        autoComplete="new-password"
        errorMessage={errors.confirmPassword?.message}
        variant={errors.confirmPassword ? 'error' : 'default'}
        {...register('confirmPassword')}
      />
      {errorMessage && <HelperText variant="error">{errorMessage}</HelperText>}
      <Button
        fullWidth
        variant="primary"
        className="mt-2"
        type="submit"
        loading={isPending}
      >
        {t.resetPassword.submitButton}
      </Button>
    </form>
  )
}
