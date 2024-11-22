import { EThemeBrowser } from '@Enums/index'
import { TThemeBrowser } from '@Store/index'

export const getSystemTheme = (): TThemeBrowser => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? EThemeBrowser.DARK
    : EThemeBrowser.LIGHT
}
