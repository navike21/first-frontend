import { TSettingsLang } from '../../types/settingsLang'

export const settingsDe: TSettingsLang = {
  title: 'Einstellungen',
  principalSettings: {
    themeMode: {
      light: 'Heller Modus',
      dark: 'Dunkler Modus',
      title: 'Themenmodus',
    },
    compact: {
      title: 'Kompakt',
      description:
        'Dieser Modus ist nur auf Bildschirmen mit einer Auflösung von 1600px oder mehr erkennbar.',
    },
    principalColor: {
      title: 'Hauptfarbe',
      description: 'Wählen Sie die Hauptfarbe der Anwendung.',
    },
    fontSize: {
      title: 'Schriftgröße',
      description: 'Wählen Sie die Schriftgröße der Anwendung.',
    },
  },
  actions: {
    resetAll: 'Alles zurücksetzen',
    fullscreen: 'Vollbild',
  },
}
