import { createStore } from '@Utils/createStore'
import { IOptionsBrowserState } from './types'
import { ELanguage } from '@Enums/language'
import { EThemeOption } from '@Enums/themeOption'
import { ESize } from '@Enums/size'
import { EColor } from '@Enums/color'

export const useOptionsBrowserStore = createStore<IOptionsBrowserState>(
  (set) => ({
    themeOption: EThemeOption.LIGHT,
    language: ELanguage.EN,
    primaryColor: EColor.GREEN,
    textSize: ESize.MD,
    compact: false,
    processName: '',
    setThemeOption: (themeOption) =>
      set((state) => ({ ...state, themeOption })),
    setLanguage: (language) => set((state) => ({ ...state, language })),
    setPrimaryColor: (primaryColor) =>
      set((state) => ({ ...state, primaryColor })),
    setTextSize: (textSize) => set((state) => ({ ...state, textSize })),
    setCompact: (compact) => set((state) => ({ ...state, compact })),
    setProcessName: (processName) =>
      set((state) => ({ ...state, processName })),
  }),
  'options-browser-store'
)
