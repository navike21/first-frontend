import { createStore } from '@Utils/createStore'
import { IOptionsBrowserState } from './types'
import { ELanguages } from '@Enums/language'
import { EThemeOption } from '@Enums/themeOption'
import { ESizes } from '@Enums/size'
import { EColors } from '@Enums/color'

export const useOptionsBrowserStore = createStore<IOptionsBrowserState>(
  (set) => ({
    themeOption: EThemeOption.LIGHT,
    language: ELanguages.EN,
    primaryColor: EColors.GREEN,
    textSize: ESizes.MD,
    compact: false,
    setThemeOption: (themeOption) =>
      set((state) => ({ ...state, themeOption })),
    setLanguage: (language) => set((state) => ({ ...state, language })),
    setPrimaryColor: (primaryColor) =>
      set((state) => ({ ...state, primaryColor })),
    setTextSize: (textSize) => set((state) => ({ ...state, textSize })),
    setCompact: (compact) => set((state) => ({ ...state, compact })),
  }),
  'options-browser-store'
)
