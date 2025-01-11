import { TSettingsLang } from '../../types/settingsLang'

export const settingsIt: TSettingsLang = {
  title: 'Impostazioni',
  principalSettings: {
    themeMode: {
      light: 'Modalità chiara',
      dark: 'Modalità scura',
      title: 'Modalità tema',
    },
    compact: {
      title: 'Compatto',
      description:
        'Questa modalità è distinguibile solo su schermi con risoluzioni di 1600px o superiori.',
    },
    principalColor: {
      title: 'Colore principale',
      description: `Seleziona il colore principale dell'applicazione.`,
    },
    fontSize: {
      title: 'Dimensione del carattere',
      description: `Seleziona la dimensione del carattere dell'applicazione.`,
    },
  },
  actions: {
    resetAll: 'Reimposta tutto',
    fullscreen: 'Schermo intero',
  },
}
