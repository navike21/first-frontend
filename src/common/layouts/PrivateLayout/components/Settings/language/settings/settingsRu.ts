import { TSettingsLang } from '../../types/settingsLang'

export const settingsRu: TSettingsLang = {
  title: 'Настройки',
  principalSettings: {
    themeMode: {
      light: 'Светлый режим',
      dark: 'Темный режим',
    },
    compact: {
      title: 'Компактный',
      description: `Этот режим различим только на экранах с разрешением от 1600px и выше.`,
    },
    principalColor: {
      title: 'Основной цвет',
      description: `Выберите основной цвет приложения.`,
    },
    fontSize: {
      title: 'Размер шрифта',
      description: `Выберите размер шрифта приложения.`,
    },
  },
  actions: {
    resetAll: 'Сбросить всё',
    fullscreen: 'Полноэкранный режим',
  },
}
