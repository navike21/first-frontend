import type { AuthTranslations } from '../types'

export const ja: AuthTranslations = {
  title: 'First',
  subtitle: 'navike21 管理システム',
  form: {
    email: 'メールアドレス',
    password: 'パスワード',
    submit: 'ログイン',
    forgotPasswordLink: 'パスワードをお忘れですか?',
  },
  forgotPassword: {
    heading: 'パスワードをお忘れですか?',
    subtitle: '登録済みのメールアドレスに復旧用リンクを送信します。',
    emailLabel: 'メールアドレス',
    submitButton: 'リンクを送信',
    backToLoginLink: '← ログインに戻る',
    successHeading: 'メールをご確認ください',
  },
  resetPassword: {
    heading: 'パスワードを再設定',
    subtitle: 'アカウントの新しいパスワードを作成してください。',
    newPasswordLabel: '新しいパスワード',
    confirmPasswordLabel: 'パスワードの確認',
    submitButton: 'パスワードを保存',
    successHeading: 'パスワードが更新されました',
    backToLoginLink: 'ログイン',
    invalidTokenHeading: '無効なリンク',
    invalidTokenMessage: 'このリンクは無効か、有効期限が切れています。',
    requestNewLinkLink: '新しいリンクをリクエスト',
  },
  validation: {
    emailInvalid: '有効なメールアドレスを入力してください',
    passwordMin: 'パスワードは8文字以上である必要があります',
    passwordUppercase: '大文字を1文字以上含める必要があります',
    passwordNumber: '数字を1文字以上含める必要があります',
    passwordMismatch: 'パスワードが一致しません',
  },
}
