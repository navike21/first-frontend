import type { LoginTranslations } from '../types'

export const ru: LoginTranslations = {
  title: 'First',
  subtitle: 'Менеджер navike21',
  form: {
    email: 'Электронная почта',
    password: 'Пароль',
    submit: 'Войти',
  },
  validation: {
    emailInvalid: 'Введите действительный адрес электронной почты',
    passwordMin: 'Пароль должен содержать не менее 8 символов',
  },
}
