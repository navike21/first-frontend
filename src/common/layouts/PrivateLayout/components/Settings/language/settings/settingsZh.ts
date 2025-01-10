import { TSettingsLang } from '../../types/settingsLang'

export const settingsZh: TSettingsLang = {
  title: '设置',
  principalSettings: {
    themeMode: {
      light: '浅色模式',
      dark: '深色模式',
    },
    compact: {
      title: '紧凑',
      description: `此模式仅在分辨率为1600px或更高的屏幕上可区分。`,
    },
    principalColor: {
      title: '主色',
      description: `选择应用程序的主色。`,
    },
    fontSize: {
      title: '字体大小',
      description: `选择应用程序的字体大小。`,
    },
  },
  actions: {
    resetAll: '重置所有',
    fullscreen: '全屏',
  },
}
