import { EColors, ESizes, EThemeBrowser } from '@Enums/index'

export type TThemeBrowser = Exclude<EThemeBrowser, EThemeBrowser.SYSTEM>

export interface ITheme {
  theme: EThemeBrowser
  themeValue: TThemeBrowser
  color: EColors
}

export interface IOptionsBrowser {
  textSize: ESizes
}

export interface IThemeStore extends ITheme, IOptionsBrowser {
  toggleTheme: () => void
  setTheme: (params: ITheme) => void
  setTextSize: (size: ESizes) => void
}
