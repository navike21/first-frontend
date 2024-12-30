import { EColors } from '@Enums/color'
import { ELanguages } from '@Enums/language'
import { ESizes } from '@Enums/size'
import { EThemeOption } from '@Enums/themeOption'

export interface IOptionsBrowserState {
  themeOption: EThemeOption
  language: ELanguages
  primaryColor: EColors
  textSize: ESizes
  setThemeOption: (themeOption: EThemeOption) => void
  setLanguage: (language: ELanguages) => void
  setPrimaryColor: (color: EColors) => void
  setTextSize: (size: ESizes) => void
}
