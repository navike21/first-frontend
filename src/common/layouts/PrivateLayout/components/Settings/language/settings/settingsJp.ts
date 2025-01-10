import { TSettingsLang } from '../../types/settingsLang'

export const settingsJp: TSettingsLang = {
  title: '設定',
  principalSettings: {
    themeMode: {
      light: 'ライトモード',
      dark: 'ダークモード',
    },
    compact: {
      title: 'コンパクト',
      description: 'このモードは、1600px以上の解像度の画面でのみ識別できます。',
    },
    principalColor: {
      title: '主要な色',
      description: 'アプリケーションの主要な色を選択してください。',
    },
    fontSize: {
      title: 'フォントサイズ',
      description: 'アプリケーションのフォントサイズを選択してください。',
    },
  },
  actions: {
    resetAll: 'すべてリセット',
    fullscreen: '全画面表示',
  },
}
