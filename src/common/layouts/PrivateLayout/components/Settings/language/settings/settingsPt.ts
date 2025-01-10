import { TSettingsLang } from '../../types/settingsLang'

export const settingsPt: TSettingsLang = {
  title: 'Configurações',
  principalSettings: {
    themeMode: {
      light: 'Modo claro',
      dark: 'Modo escuro',
    },
    compact: {
      title: 'Compacto',
      description: `Este modo só pode ser diferenciado em telas com resolução de 1600px ou superior.`,
    },
    principalColor: {
      title: 'Cor principal',
      description: `Selecione a cor principal do aplicativo.`,
    },
    fontSize: {
      title: 'Tamanho da fonte',
      description: `Selecione o tamanho da fonte do aplicativo.`,
    },
  },
  actions: {
    resetAll: 'Redefinir tudo',
    fullscreen: 'Tela cheia',
  },
}
