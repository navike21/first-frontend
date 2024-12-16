import { MIN_PASSWORD_LENGTH } from '@Pages/Login/constants'
import { TLoginForm } from '@Pages/Login/types'

export const loginFormFr: TLoginForm = {
  fields: {
    email: {
      label: 'E-mail',
      placeholder: 'Entrez votre e-mail',
      error: "L'e-mail n'est pas valide",
      required: "L'e-mail ne peut pas être vide",
    },
    password: {
      label: 'Mot de passe',
      placeholder: 'Entrez votre mot de passe',
      required: 'Le mot de passe ne peut pas être vide',
      min: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`,
      togglePassword: 'Afficher ou masquer le mot de passe',
    },
    submit: {
      label: 'Se connecter',
    },
  },
  links: {
    forgotPassword: 'Mot de passe oublié ?',
    getStarted: 'Commencer',
  },
  title: 'Connectez-vous à votre compte',
  subtitle: 'Vous n’avez pas de compte ?',
  api: {
    error: {
      unexpected: 'Une erreur inattendue s’est produite lors de la connexion',
    },
  },
}
