import type { AuthTranslations } from '../types'

export const en: AuthTranslations = {
  title: 'First',
  subtitle: 'navike21 Manager',
  form: {
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    forgotPasswordLink: 'Forgot your password?',
  },
  forgotPassword: {
    heading: 'Forgot your password?',
    subtitle: "We'll send a recovery link to your registered email.",
    emailLabel: 'Email',
    submitButton: 'Send link',
    backToLoginLink: '← Back to sign in',
    successHeading: 'Check your email',
  },
  resetPassword: {
    heading: 'Reset password',
    subtitle: 'Create a new password for your account.',
    newPasswordLabel: 'New password',
    confirmPasswordLabel: 'Confirm password',
    submitButton: 'Save password',
    successHeading: 'Password updated',
    backToLoginLink: 'Sign in',
    invalidTokenHeading: 'Invalid link',
    invalidTokenMessage: 'This link is invalid or has expired.',
    requestNewLinkLink: 'Request a new link',
  },
  validation: {
    emailInvalid: 'Enter a valid email address',
    passwordMin: 'Password must be at least 8 characters',
    passwordUppercase: 'Must contain at least one uppercase letter',
    passwordNumber: 'Must contain at least one number',
    passwordMismatch: 'Passwords do not match',
  },
}
