export interface AuthTranslations {
  title: string
  subtitle: string
  form: {
    email: string
    password: string
    submit: string
    forgotPasswordLink: string
  }
  forgotPassword: {
    heading: string
    subtitle: string
    emailLabel: string
    submitButton: string
    backToLoginLink: string
    successHeading: string
  }
  resetPassword: {
    heading: string
    subtitle: string
    newPasswordLabel: string
    confirmPasswordLabel: string
    submitButton: string
    successHeading: string
    backToLoginLink: string
    invalidTokenHeading: string
    invalidTokenMessage: string
    requestNewLinkLink: string
  }
  validation: {
    emailInvalid: string
    passwordMin: string
    passwordUppercase: string
    passwordNumber: string
    passwordMismatch: string
  }
}
