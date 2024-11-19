import { EThemeBrowser } from '@Enums/browser'
import { TThemeBrowser } from '@Store/config'

export const getSystemTheme = (): TThemeBrowser => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? EThemeBrowser.DARK
    : EThemeBrowser.LIGHT
}
