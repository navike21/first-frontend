import type { AuthTranslations } from '../types'

export const es: AuthTranslations = {
  title: 'First',
  subtitle: 'Gestor navike21',
  form: {
    email: 'Correo electrónico',
    password: 'Contraseña',
    submit: 'Iniciar sesión',
    forgotPasswordLink: '¿Olvidaste tu contraseña?',
  },
  forgotPassword: {
    heading: '¿Olvidaste tu contraseña?',
    subtitle: 'Te enviaremos un enlace de recuperación a tu correo registrado.',
    emailLabel: 'Correo electrónico',
    submitButton: 'Enviar enlace',
    backToLoginLink: '← Volver a inicio de sesión',
    successHeading: 'Revisa tu correo',
  },
  resetPassword: {
    heading: 'Restablecer contraseña',
    subtitle: 'Crea una nueva contraseña para tu cuenta.',
    newPasswordLabel: 'Nueva contraseña',
    confirmPasswordLabel: 'Confirmar contraseña',
    submitButton: 'Guardar contraseña',
    successHeading: 'Contraseña actualizada',
    backToLoginLink: 'Iniciar sesión',
    invalidTokenHeading: 'Enlace inválido',
    invalidTokenMessage: 'Este enlace no es válido o ya expiró.',
    requestNewLinkLink: 'Solicitar un nuevo enlace',
  },
  validation: {
    emailInvalid: 'Introduce un correo electrónico válido',
    passwordMin: 'La contraseña debe tener al menos 8 caracteres',
    passwordUppercase: 'Debe contener al menos una mayúscula',
    passwordNumber: 'Debe contener al menos un número',
    passwordMismatch: 'Las contraseñas no coinciden',
  },
}
