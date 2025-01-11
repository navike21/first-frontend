import { TSettingsLang } from '../../types/settingsLang'

export const settingsFr: TSettingsLang = {
  title: 'Paramètres',
  principalSettings: {
    themeMode: {
      light: 'Mode clair',
      dark: 'Mode sombre',
      title: 'Mode thème',
    },
    compact: {
      title: 'Compact',
      description:
        'Ce mode est uniquement distinguable sur les écrans avec une résolution de 1600px ou plus.',
    },
    principalColor: {
      title: 'Couleur principale',
      description: `Sélectionnez la couleur principale de l'application.`,
    },
    fontSize: {
      title: 'Taille de la police',
      description: `Sélectionnez la taille de la police de l'application.`,
    },
  },
  actions: {
    resetAll: 'Réinitialiser tout',
    fullscreen: 'Plein écran',
  },
}
