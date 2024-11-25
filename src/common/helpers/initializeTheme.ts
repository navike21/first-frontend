import { EThemeBrowser } from '@Enums/browser'
import { EColors } from '@Enums/color'
import { ESizes } from '@Enums/sizes'
import { STORAGE_KEY_THEME_STORE, useThemeStore } from '@Store/index'
import { getItemLocalStorageObject } from '@Utils/localStorage'

export const initializeTheme = () => {
  const themeStore = useThemeStore.getState()
  const storedTheme = getItemLocalStorageObject(STORAGE_KEY_THEME_STORE)

  const theme = storedTheme?.theme ?? EThemeBrowser.SYSTEM
  const themeValue = storedTheme?.themeValue ?? EThemeBrowser.LIGHT
  const color = storedTheme?.color ?? EColors.GREEN
  const textSize = storedTheme?.textSize ?? ESizes.MD

  themeStore.setTheme({ theme, themeValue, color })
  themeStore.setTextSize(textSize)
}
