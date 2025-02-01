import { EColors } from '@Enums/color'
import { ELanguages } from '@Enums/language'
import { EProcessName } from '@Enums/processName'
import { ESizes } from '@Enums/size'
import { EThemeOption } from '@Enums/themeOption'

export interface IOptionsBrowserState {
  themeOption: EThemeOption
  language: ELanguages
  primaryColor: EColors
  textSize: ESizes
  compact: boolean
  processName: EProcessName | ''
  setThemeOption: (themeOption: EThemeOption) => void
  setLanguage: (language: ELanguages) => void
  setPrimaryColor: (color: EColors) => void
  setTextSize: (size: ESizes) => void
  setCompact: (compact: boolean) => void
  setProcessName: (processName: EProcessName) => void
}
