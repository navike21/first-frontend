import { MIN_PASSWORD_LENGTH } from '../../constants/constants'
import { TLoginForm } from '../../types/types'

export const loginFormEs: TLoginForm = {
  fields: {
    email: {
      label: 'Correo electrónico',
      placeholder: 'Introduce tu correo electrónico',
      error: 'El correo electrónico no es válido',
      required: 'El correo electrónico no puede estar vacío',
    },
    password: {
      label: 'Contraseña',
      placeholder: 'Introduce tu contraseña',
      required: 'La contraseña no puede estar vacía',
      min: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      togglePassword: 'Mostrar u ocultar contraseña',
    },
    submit: {
      label: 'Iniciar sesión',
    },
  },
  links: {
    forgotPassword: '¿Olvidaste tu contraseña?',
    getStarted: 'Empezar',
  },
  title: 'Inicia sesión en tu cuenta',
  subtitle: '¿No tienes una cuenta?',
  api: {
    error: {
      unexpected: 'Ha ocurrido un error inesperado al iniciar sesión',
    },
  },
}
