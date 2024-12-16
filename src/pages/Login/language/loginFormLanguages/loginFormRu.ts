import { MIN_PASSWORD_LENGTH } from '@Pages/Login/constants'
import { TLoginForm } from '@Pages/Login/types'

export const loginFormRu: TLoginForm = {
  fields: {
    email: {
      label: 'Электронная почта',
      placeholder: 'Введите вашу электронную почту',
      error: 'Электронная почта недействительна',
      required: 'Электронная почта не может быть пустой',
    },
    password: {
      label: 'Пароль',
      placeholder: 'Введите ваш пароль',
      required: 'Пароль не может быть пустым',
      min: `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} символов`,
      togglePassword: 'Показать или скрыть пароль',
    },
    submit: {
      label: 'Войти',
    },
  },
  links: {
    forgotPassword: 'Забыли пароль?',
    getStarted: 'Начать',
  },
  title: 'Войдите в свой аккаунт',
  subtitle: 'У вас нет аккаунта?',
  api: {
    error: {
      unexpected: 'Произошла непредвиденная ошибка при входе в систему',
    },
  },
}
