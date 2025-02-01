import { EColor } from '@Enums/color'
import { ELanguage } from '@Enums/language'
import { EProcessName } from '@Enums/processName'
import { ESize } from '@Enums/size'
import { EThemeOption } from '@Enums/themeOption'

export interface IOptionsBrowserState {
  themeOption: EThemeOption
  language: ELanguage
  primaryColor: EColor
  textSize: ESize
  compact: boolean
  processName: EProcessName | ''
  setThemeOption: (themeOption: EThemeOption) => void
  setLanguage: (language: ELanguage) => void
  setPrimaryColor: (color: EColor) => void
  setTextSize: (size: ESize) => void
  setCompact: (compact: boolean) => void
  setProcessName: (processName: EProcessName) => void
}
