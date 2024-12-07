import { createStore, getBrowserLanguage, getSystemTheme } from '@Utils/index'
import { EColors, ESizes, EThemeBrowser } from '@Enums/index'
import { STORAGE_KEY_THEME_STORE } from './constant'
import { IThemeStore } from './types'

export const useThemeStore = createStore<IThemeStore>(
  (set, get) => ({
    color: EColors.GREEN,
    theme: EThemeBrowser.SYSTEM,
    themeValue: getSystemTheme(),
    textSize: ESizes.MD,
    language: getBrowserLanguage(),
    toggleTheme: () => {
      const { theme } = get()
      const newTheme =
        theme === EThemeBrowser.LIGHT ? EThemeBrowser.DARK : EThemeBrowser.LIGHT

      set({
        theme: newTheme,
        themeValue: newTheme,
      })
    },
    setTheme: ({ theme, themeValue }) => {
      set({
        theme,
        themeValue:
          theme === EThemeBrowser.SYSTEM ? getSystemTheme() : themeValue,
      })
    },
    setTextSize: (size) => {
      set({
        textSize: size,
      })
    },
    setLanguage: (language) => {
      set({
        language,
      })
    },
  }),
  {
    name: STORAGE_KEY_THEME_STORE,
  }
)
