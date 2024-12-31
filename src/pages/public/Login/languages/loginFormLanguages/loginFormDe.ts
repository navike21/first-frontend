import { MIN_PASSWORD_LENGTH } from '../../constants/constants'
import { TLoginForm } from '../../types/types'

export const loginFormDe: TLoginForm = {
  fields: {
    email: {
      label: 'E-Mail',
      placeholder: 'Geben Sie Ihre E-Mail ein',
      error: 'Die E-Mail ist nicht gültig',
      required: 'E-Mail darf nicht leer sein',
    },
    password: {
      label: 'Passwort',
      placeholder: 'Geben Sie Ihr Passwort ein',
      required: 'Passwort darf nicht leer sein',
      min: `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein`,
      togglePassword: 'Passwort anzeigen oder verbergen',
    },
    submit: {
      label: 'Anmelden',
    },
  },
  links: {
    forgotPassword: 'Passwort vergessen?',
    getStarted: 'Loslegen',
  },
  title: 'Melden Sie sich bei Ihrem Konto an',
  subtitle: 'Sie haben noch kein Konto?',
  api: {
    error: {
      unexpected: 'Ein unerwarteter Fehler ist beim Anmelden aufgetreten',
    },
  },
}
