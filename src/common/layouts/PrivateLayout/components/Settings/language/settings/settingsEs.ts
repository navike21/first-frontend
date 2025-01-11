import { TSettingsLang } from '../../types/settingsLang'

export const settingsEs: TSettingsLang = {
  title: 'Configuración',
  principalSettings: {
    themeMode: {
      light: 'Modo claro',
      dark: 'Modo oscuro',
      title: 'Modo de tema',
    },
    compact: {
      title: 'Compacto',
      description:
        'Este modo solo se puede diferenciar en pantallas con resolución desde 1600px o más.',
    },
    principalColor: {
      title: 'Color principal',
      description: 'Seleccione el color principal de la aplicación.',
    },
    fontSize: {
      title: 'Tamaño de fuente',
      description: 'Seleccione el tamaño de fuente de la aplicación.',
    },
  },
  actions: {
    resetAll: 'Restablecer todo',
    fullscreen: 'Pantalla completa',
  },
}
