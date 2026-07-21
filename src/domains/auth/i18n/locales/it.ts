import type { AuthTranslations } from '../types'

export const it: AuthTranslations = {
  title: 'First',
  subtitle: 'Gestore navike21',
  form: {
    email: 'Email',
    password: 'Password',
    submit: 'Accedi',
    forgotPasswordLink: 'Password dimenticata?',
  },
  forgotPassword: {
    heading: 'Password dimenticata?',
    subtitle: 'Ti invieremo un link di recupero alla tua email registrata.',
    emailLabel: 'Email',
    submitButton: 'Invia link',
    backToLoginLink: '← Torna al login',
    successHeading: 'Controlla la tua email',
  },
  resetPassword: {
    heading: 'Reimposta password',
    subtitle: 'Crea una nuova password per il tuo account.',
    newPasswordLabel: 'Nuova password',
    confirmPasswordLabel: 'Conferma password',
    submitButton: 'Salva password',
    successHeading: 'Password aggiornata',
    backToLoginLink: 'Accedi',
    invalidTokenHeading: 'Link non valido',
    invalidTokenMessage: 'Questo link non è valido o è scaduto.',
    requestNewLinkLink: 'Richiedi un nuovo link',
  },
  validation: {
    emailInvalid: 'Inserisci un indirizzo email valido',
    passwordMin: 'La password deve contenere almeno 8 caratteri',
    passwordUppercase: 'Deve contenere almeno una lettera maiuscola',
    passwordNumber: 'Deve contenere almeno un numero',
    passwordMismatch: 'Le password non coincidono',
  },
}
