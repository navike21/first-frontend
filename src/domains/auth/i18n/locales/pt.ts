import type { AuthTranslations } from '../types'

export const pt: AuthTranslations = {
  title: 'First',
  subtitle: 'Gestor navike21',
  form: {
    email: 'E-mail',
    password: 'Palavra-passe',
    submit: 'Entrar',
    forgotPasswordLink: 'Esqueceu-se da palavra-passe?',
  },
  forgotPassword: {
    heading: 'Esqueceu-se da palavra-passe?',
    subtitle: 'Enviaremos um link de recuperação para o seu e-mail registado.',
    emailLabel: 'E-mail',
    submitButton: 'Enviar link',
    backToLoginLink: '← Voltar ao início de sessão',
    successHeading: 'Verifique o seu e-mail',
  },
  resetPassword: {
    heading: 'Repor palavra-passe',
    subtitle: 'Crie uma nova palavra-passe para a sua conta.',
    newPasswordLabel: 'Nova palavra-passe',
    confirmPasswordLabel: 'Confirmar palavra-passe',
    submitButton: 'Guardar palavra-passe',
    successHeading: 'Palavra-passe atualizada',
    backToLoginLink: 'Iniciar sessão',
    invalidTokenHeading: 'Link inválido',
    invalidTokenMessage: 'Este link é inválido ou já expirou.',
    requestNewLinkLink: 'Solicitar um novo link',
  },
  validation: {
    emailInvalid: 'Introduza um endereço de e-mail válido',
    passwordMin: 'A palavra-passe deve ter pelo menos 8 caracteres',
    passwordUppercase: 'Deve conter pelo menos uma letra maiúscula',
    passwordNumber: 'Deve conter pelo menos um número',
    passwordMismatch: 'As senhas não coincidem',
  },
}
