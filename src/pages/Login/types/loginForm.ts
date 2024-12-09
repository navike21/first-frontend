export type TLoginForm = {
  fields: TLoginFormFields
  links: TLoginFormLinks
  title: string
  subtitle: string
}

export type TLoginFormFields = {
  email: TLoginFormEmail
  password: TLoginFormPassword
  submit: TLoginFormSubmit
}

export type TLoginFormEmail = {
  label: string
  placeholder: string
  error: string
  required: string
}

export type TLoginFormPassword = {
  label: string
  placeholder: string
  required: string
  min: string
  togglePassword: string
}

export type TLoginFormSubmit = {
  label: string
}

export type TLoginFormLinks = {
  forgotPassword: string
  getStarted: string
}
