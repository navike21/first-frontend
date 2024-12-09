import { MIN_PASSWORD_LENGTH } from '@Pages/Login/constants'
import { TLoginForm } from '@Pages/Login/types'

export const loginFormPt: TLoginForm = {
  fields: {
    email: {
      label: 'E-mail',
      placeholder: 'Insira seu e-mail',
      error: 'O e-mail não é válido',
      required: 'O e-mail não pode estar vazio',
    },
    password: {
      label: 'Senha',
      placeholder: 'Insira sua senha',
      required: 'A senha não pode estar vazia',
      min: `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`,
      togglePassword: 'Mostrar ou ocultar senha',
    },
    submit: {
      label: 'Entrar',
    },
  },
  links: {
    forgotPassword: 'Esqueceu sua senha?',
    getStarted: 'Começar',
  },
  title: 'Entre na sua conta',
  subtitle: 'Não tem uma conta?',
}
