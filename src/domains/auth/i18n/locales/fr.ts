import type { AuthTranslations } from '../types'

export const fr: AuthTranslations = {
  title: 'First',
  subtitle: 'Gestionnaire navike21',
  form: {
    email: 'E-mail',
    password: 'Mot de passe',
    submit: 'Se connecter',
    forgotPasswordLink: 'Mot de passe oublié ?',
  },
  forgotPassword: {
    heading: 'Mot de passe oublié ?',
    subtitle: 'Nous vous enverrons un lien de récupération à votre e-mail enregistré.',
    emailLabel: 'E-mail',
    submitButton: 'Envoyer le lien',
    backToLoginLink: '← Retour à la connexion',
    successHeading: 'Consultez votre e-mail',
  },
  resetPassword: {
    heading: 'Réinitialiser le mot de passe',
    subtitle: 'Créez un nouveau mot de passe pour votre compte.',
    newPasswordLabel: 'Nouveau mot de passe',
    confirmPasswordLabel: 'Confirmer le mot de passe',
    submitButton: 'Enregistrer le mot de passe',
    successHeading: 'Mot de passe mis à jour',
    backToLoginLink: 'Se connecter',
    invalidTokenHeading: 'Lien invalide',
    invalidTokenMessage: 'Ce lien est invalide ou a expiré.',
    requestNewLinkLink: 'Demander un nouveau lien',
  },
  validation: {
    emailInvalid: 'Saisissez une adresse e-mail valide',
    passwordMin: 'Le mot de passe doit comporter au moins 8 caractères',
    passwordUppercase: 'Doit contenir au moins une majuscule',
    passwordNumber: 'Doit contenir au moins un chiffre',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
  },
}
