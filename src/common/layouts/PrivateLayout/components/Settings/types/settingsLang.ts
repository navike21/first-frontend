export type TSettingsLang = {
  title: string
  principalSettings: TPrincipalSettings
  actions: TActions
}

export type TThemeMode = {
  light: string
  dark: string
}

export type TCompact = {
  title: string
  description: string
}

export type TPrincipalColor = {
  title: string
  description: string
}

export type TFontSize = {
  title: string
  description: string
}

export type TPrincipalSettings = {
  themeMode: TThemeMode
  compact: TCompact
  principalColor: TPrincipalColor
  fontSize: TFontSize
}

export type TActions = {
  resetAll: string
  fullscreen: string
}
