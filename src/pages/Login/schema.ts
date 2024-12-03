import * as yup from 'yup'
import { TLoginFields } from './types'

export const loginSchema = (): yup.ObjectSchema<TLoginFields> =>
  yup.object({
    email: yup
      .string()
      .email('Invalid email format')
      .required("Email can't be empty"),
    password: yup
      .string()
      .required("Password can't be empty")
      .min(4, 'Password must be at least 9 characters long'),
  })
