import { ELanguage } from '@Enums/language'
import * as yup from 'yup'
import { TLoginFields } from '../types/types'
import { MIN_PASSWORD_LENGTH } from '../constants/constants'
import { loginForm } from '../languages/loginForm'

export const loginSchema = (
  language: ELanguage
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
