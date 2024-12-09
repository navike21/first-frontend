import { MIN_PASSWORD_LENGTH } from '@Pages/Login/constants'
import { TLoginForm } from '@Pages/Login/types'

export const loginFormEn: TLoginForm = {
  fields: {
    email: {
      label: 'Email',
      placeholder: 'Enter your email',
      error: 'The email is not valid',
      required: 'Email cannot be empty',
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      required: 'Password cannot be empty',
      min: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      togglePassword: 'Show or hide password',
    },
    submit: {
      label: 'Log in',
    },
  },
  links: {
    forgotPassword: 'Forgot your password?',
    getStarted: 'Get started',
  },
  title: 'Log in to your account',
  subtitle: 'Don’t have an account?',
}
