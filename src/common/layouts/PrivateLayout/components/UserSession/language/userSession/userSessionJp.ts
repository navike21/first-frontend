import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionJp: TUserSessionLang = {
  mainMenu: {
    title: 'メインメニュー',
    items: [
      {
        label: 'プロフィール',
        icon: EIcons.PROFILE,
        urlPath: 'profile',
      },
      {
        label: 'メッセージ',
        icon: EIcons.MESSAGES,
        urlPath: 'messages',
      },
      {
        label: 'セキュリティ',
        icon: EIcons.SECURITY,
        urlPath: 'security',
      },
      {
        label: 'ヘルプとサポート',
        icon: EIcons.HELP,
        urlPath: 'help-and-support',
      },
      {
        label: 'システム情報',
        icon: EIcons.INFO,
        urlPath: 'system-information',
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
