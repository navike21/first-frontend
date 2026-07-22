import type { AuthTranslations } from '../types'

export const de: AuthTranslations = {
  title: 'First',
  subtitle: 'navike21 Verwaltung',
  form: {
    email: 'E-Mail',
    password: 'Passwort',
    submit: 'Anmelden',
    forgotPasswordLink: 'Passwort vergessen?',
  },
  forgotPassword: {
    heading: 'Passwort vergessen?',
    subtitle:
      'Wir senden Ihnen einen Wiederherstellungslink an Ihre registrierte E-Mail-Adresse.',
    emailLabel: 'E-Mail',
    submitButton: 'Link senden',
    backToLoginLink: '← Zurück zur Anmeldung',
    successHeading: 'Prüfen Sie Ihre E-Mails',
  },
  resetPassword: {
    heading: 'Passwort zurücksetzen',
    subtitle: 'Erstellen Sie ein neues Passwort für Ihr Konto.',
    newPasswordLabel: 'Neues Passwort',
    confirmPasswordLabel: 'Passwort bestätigen',
    submitButton: 'Passwort speichern',
    successHeading: 'Passwort aktualisiert',
    backToLoginLink: 'Anmelden',
    invalidTokenHeading: 'Ungültiger Link',
    invalidTokenMessage: 'Dieser Link ist ungültig oder abgelaufen.',
    requestNewLinkLink: 'Neuen Link anfordern',
  },
  validation: {
    emailInvalid: 'Geben Sie eine gültige E-Mail-Adresse ein',
    passwordMin: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    passwordUppercase: 'Muss mindestens einen Großbuchstaben enthalten',
    passwordNumber: 'Muss mindestens eine Zahl enthalten',
    passwordMismatch: 'Passwörter stimmen nicht überein',
  },
}
