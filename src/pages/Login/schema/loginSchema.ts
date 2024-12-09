import * as yup from 'yup'
import { TLoginFields } from '../types'
import { ELanguages } from '@Enums/language'
import { loginForm } from '../language'
import { MIN_PASSWORD_LENGTH } from '../constants'

export const loginSchema = (
  language: ELanguages
): yup.ObjectSchema<TLoginFields> => {
  const {
    fields: { email, password },
  } = loginForm[language]

  return yup.object({
    email: yup.string().email(email.error).required(email.required),
    password: yup
      .string()
      .required(password.required)
      .min(MIN_PASSWORD_LENGTH, password.min),
  })
}
