import { TSettingsLang } from '../../types/settingsLang'

export const settingsEn: TSettingsLang = {
  title: 'Settings',
  principalSettings: {
    themeMode: {
      light: 'Light Mode',
      dark: 'Dark Mode',
    },
    compact: {
      title: 'Compact',
      description:
        'This mode can only be distinguished on screens with resolutions of 1600px or more.',
    },
    principalColor: {
      title: 'Primary Color',
      description: 'Select the primary color of the application.',
    },
    fontSize: {
      title: 'Font Size',
      description: 'Select the font size of the application.',
    },
  },
  actions: {
    resetAll: 'Reset All',
    fullscreen: 'Fullscreen',
  },
}
