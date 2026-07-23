import clsx from 'clsx'
import { Button, InputField, HelperText, LinkButton } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { useForgotPasswordForm } from './ForgotPasswordForm.hooks'

export const ForgotPasswordForm = () => {
  const {
    t,
    register,
    onSubmit,
    errors,
    isPending,
    isSuccess,
    successMessage,
    errorMessage,
  } = useForgotPasswordForm()

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-foreground text-base font-semibold">
          {t.forgotPassword.successHeading}
        </h2>
        {successMessage && (
          <p className="text-secondary text-sm">{successMessage}</p>
        )}
        <LinkButton variant="secondary" href={navPaths.login()}>
          {t.forgotPassword.backToLoginLink}
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
        {t.forgotPassword.heading}
      </h2>
      <InputField
        label={t.forgotPassword.emailLabel}
        type="email"
        autoComplete="email"
        errorMessage={errors.email?.message}
        variant={errors.email ? 'error' : 'default'}
        {...register('email')}
      />
      {errorMessage && <HelperText variant="error">{errorMessage}</HelperText>}
      <Button
        fullWidth
        variant="primary"
        className="mt-2"
        type="submit"
        loading={isPending}
      >
        {t.forgotPassword.submitButton}
      </Button>
      <LinkButton
        variant="text"
        href={navPaths.login()}
        className="text-center"
      >
        {t.forgotPassword.backToLoginLink}
      </LinkButton>
    </form>
  )
}
