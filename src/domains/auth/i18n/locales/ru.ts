import type { AuthTranslations } from '../types'

export const ru: AuthTranslations = {
  title: 'First',
  subtitle: 'Менеджер navike21',
  form: {
    email: 'Электронная почта',
    password: 'Пароль',
    submit: 'Войти',
    forgotPasswordLink: 'Забыли пароль?',
  },
  forgotPassword: {
    heading: 'Забыли пароль?',
    subtitle: 'Мы отправим ссылку для восстановления на ваш зарегистрированный email.',
    emailLabel: 'Электронная почта',
    submitButton: 'Отправить ссылку',
    backToLoginLink: '← Вернуться к входу',
    successHeading: 'Проверьте вашу почту',
  },
  resetPassword: {
    heading: 'Сброс пароля',
    subtitle: 'Создайте новый пароль для вашей учётной записи.',
    newPasswordLabel: 'Новый пароль',
    confirmPasswordLabel: 'Подтвердите пароль',
    submitButton: 'Сохранить пароль',
    successHeading: 'Пароль обновлён',
    backToLoginLink: 'Войти',
    invalidTokenHeading: 'Недействительная ссылка',
    invalidTokenMessage: 'Эта ссылка недействительна или истёк срок её действия.',
    requestNewLinkLink: 'Запросить новую ссылку',
  },
  validation: {
    emailInvalid: 'Введите действительный адрес электронной почты',
    passwordMin: 'Пароль должен содержать не менее 8 символов',
    passwordUppercase: 'Должен содержать хотя бы одну заглавную букву',
    passwordNumber: 'Должен содержать хотя бы одну цифру',
    passwordMismatch: 'Пароли не совпадают',
  },
}
