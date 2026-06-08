import type { ErrorTranslations } from '../types'

export const ja: ErrorTranslations = {
  forbidden: {
    heading: 'アクセス制限',
    message:
      'このページにアクセスするためのアクティブなセッションがありません。ログインして続けてください。',
    loginButton: 'ログイン',
  },
  notFound: {
    heading: 'ページが見つかりません',
    message:
      'お探しのページは存在しないか、移動されました。URLを確認するか、ホームに戻ってください。',
    backButton: '前のページ',
    homeButton: 'ホームへ',
    loginButton: 'ログイン',
  },
}
