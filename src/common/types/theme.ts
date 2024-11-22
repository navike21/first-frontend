import { EColors } from '@Enums/color'
import { ESizes } from '@Enums/sizes'
import { TThemeBrowser } from '@Store/index'

export type TMaterialTheme = {
  themeMode: TThemeBrowser
  textSize: ESizes
  color: EColors
}
