import { MIN_PASSWORD_LENGTH } from '../../constants/constants'
import { TLoginForm } from '../../types/types'

export const loginFormIt: TLoginForm = {
  fields: {
    email: {
      label: 'Email',
      placeholder: 'Inserisci la tua email',
      error: "L'email non è valida",
      required: "L'email non può essere vuota",
    },
    password: {
      label: 'Password',
      placeholder: 'Inserisci la tua password',
      required: 'La password non può essere vuota',
      min: `La password deve avere almeno ${MIN_PASSWORD_LENGTH} caratteri`,
      togglePassword: 'Mostra o nascondi la password',
    },
    submit: {
      label: 'Accedi',
    },
  },
  links: {
    forgotPassword: 'Hai dimenticato la password?',
    getStarted: 'Inizia ora',
  },
  title: 'Accedi al tuo account',
  subtitle: 'Non hai un account?',
  api: {
    error: {
      unexpected: "Si è verificato un errore imprevisto durante l'accesso",
    },
  },
}
