import { MIN_PASSWORD_LENGTH } from '../../constants/constants'
import { TLoginForm } from '../../types/types'

export const loginFormJp: TLoginForm = {
  fields: {
    email: {
      label: 'メールアドレス',
      placeholder: 'メールアドレスを入力してください',
      error: '有効なメールアドレスではありません',
      required: 'メールアドレスを空にすることはできません',
    },
    password: {
      label: 'パスワード',
      placeholder: 'パスワードを入力してください',
      required: 'パスワードを空にすることはできません',
      min: `パスワードは${MIN_PASSWORD_LENGTH}文字以上である必要があります`,
      togglePassword: 'パスワードを表示または非表示にする',
    },
    submit: {
      label: 'ログイン',
    },
  },
  links: {
    forgotPassword: 'パスワードをお忘れですか？',
    getStarted: '始める',
  },
  title: 'アカウントにログインする',
  subtitle: 'アカウントをお持ちではありませんか？',
  api: {
    error: {
      unexpected: 'ログイン中に予期しないエラーが発生しました',
    },
  },
}
