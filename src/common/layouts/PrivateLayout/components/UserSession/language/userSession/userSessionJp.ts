import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionJp: TUserSessionLang = {
  mainMenu: {
    title: 'メインメニュー',
    items: [
      {
        label: 'プロフィール',
        icon: EIcons.PROFILE,
      },
      {
        label: 'メッセージ',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'セキュリティ',
        icon: EIcons.SECURITY,
      },
      {
        label: 'ヘルプとサポート',
        icon: EIcons.HELP,
      },
      {
        label: 'システム情報',
        icon: EIcons.INFO,
      },
    ],
  },
  logOut: {
    title: 'ログアウト',
    modalConfirm: {
      title: 'ログアウト',
      content: 'ログアウトしてもよろしいですか？',
      actions: {
        cancel: 'いいえ、キャンセル',
        confirm: 'はい、ログアウト',
      },
    },
  },
}
